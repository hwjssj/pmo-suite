import express from 'express';
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRepository, currentLocalMinute, openDatabase } from './database.js';
import { config } from './config.js';
import { createLogger } from './logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const publicRoot = projectRoot;
const sessionCookieName = 'pmo_session';
const logger = createLogger({ level: config.logLevel });

function normalizeRole(role) {
  if (role === 'project_owner') return 'pm';
  if (['pmo', 'pm', 'member'].includes(role)) return role;
  return 'member';
}

export function validateBusinessState(state) {
  if (!state || typeof state !== 'object') return 'state 必须是对象';
  const requiredArrays = ['users', 'projects', 'sprints', 'requirements', 'milestones', 'timelineNodes'];
  const invalidKey = requiredArrays.find((key) => !Array.isArray(state[key]));
  if (invalidKey) return `${invalidKey} 必须是数组`;
  const duplicateAccount = new Set();
  for (const user of state.users) {
    if (!user.id || !user.account || !user.name) return '用户必须包含 id、account 和 name';
    const account = String(user.account).toLowerCase();
    if (duplicateAccount.has(account)) return '用户账号不能重复';
    duplicateAccount.add(account);
  }
  return '';
}

function appendAudit(state, event = 'state.saved') {
  const existingLogs = Array.isArray(state.auditLogs) ? state.auditLogs : [];
  const logs = existingLogs.at(-1)?.event === event && existingLogs.at(-1)?.source !== 'server'
    ? existingLogs.slice(0, -1)
    : existingLogs;
  return [
    ...logs,
    {
      id: `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      at: currentLocalMinute(),
      actor: state.currentUserId || 'system',
      event,
      source: 'server',
    },
  ].slice(-100);
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    if (index < 0) return [part, ''];
    return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
  }));
}

function tokenHash(token) {
  return createHash('sha256').update(token).digest('hex');
}

function createSession(repository, userId) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = currentLocalMinute(new Date(Date.now() + config.sessionTtlMs));
  repository.createSession(tokenHash(token), userId, expiresAt);
  return { token, expiresAt };
}

function cookieOptions(expiresAt = '') {
  const secure = config.nodeEnv === 'production' ? '; Secure' : '';
  const expires = expiresAt ? `; Expires=${new Date(expiresAt.replace(' ', 'T')).toUTCString()}` : '';
  return `HttpOnly; SameSite=Lax; Path=/${secure}${expires}`;
}

function readSession(repository, request) {
  const token = parseCookies(request.headers.cookie || '')[sessionCookieName];
  if (!token) return null;
  const session = repository.getSession(tokenHash(token));
  if (!session) return null;
  const state = repository.getState();
  const user = state?.users?.find((item) => item.id === session.user_id && item.status === 'active');
  if (!user) return null;
  return { token, session, user, state };
}

function requireAuth(repository) {
  return (request, response, next) => {
    const auth = readSession(repository, request);
    if (!auth) {
      response.status(401).json({ error: '未登录或登录已失效', requestId: request.requestId });
      return;
    }
    request.auth = auth;
    next();
  };
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString('base64url');
  const hash = scryptSync(String(password), salt, 32).toString('base64url');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password, storedHash = '') {
  if (!storedHash?.startsWith('scrypt$')) return false;
  const [, salt, expected] = storedHash.split('$');
  const actual = scryptSync(String(password), salt, 32);
  const expectedBuffer = Buffer.from(expected, 'base64url');
  return expectedBuffer.length === actual.length && timingSafeEqual(actual, expectedBuffer);
}

function checksum(value) {
  return createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

export function sanitizeStateForClient(state, currentUserId = '') {
  if (!state) return null;
  return {
    ...state,
    currentUserId,
    users: (state.users || []).map(({ password, passwordHash, ...user }) => ({
      ...user,
      hasPassword: Boolean(passwordHash || password),
    })),
  };
}

export function createInitialState({ account, name, password }) {
  const userId = `u-${Date.now()}-${randomBytes(4).toString('hex')}`;
  return secureStateForStorage({
    schemaVersion: 1,
    authSeedVersion: 1,
    view: 'overview',
    selectedProjectId: '',
    selectedSprintId: '',
    selectedRequirementId: '',
    selectedMilestoneId: '',
    search: '',
    projectStatus: 'all',
    sprintStatus: 'all',
    currentUserId: '',
    loginError: '',
    users: [{
      id: userId,
      account,
      name,
      password,
      role: 'pmo',
      status: 'active',
    }],
    projects: [],
    sprints: [],
    requirements: [],
    milestones: [],
    timelineNodes: [],
    auditLogs: [],
  });
}

export function secureStateForStorage(incomingState, existingState = null) {
  const existingUsers = new Map((existingState?.users || []).map((user) => [user.id, user]));
  return {
    ...incomingState,
    currentUserId: '',
    users: incomingState.users.map((user) => {
      const existing = existingUsers.get(user.id);
      const nextUser = { ...user, role: normalizeRole(user.role), account: String(user.account || '').toLowerCase() };
      if (nextUser.password) {
        nextUser.passwordHash = hashPassword(nextUser.password);
      } else if (existing?.passwordHash) {
        nextUser.passwordHash = existing.passwordHash;
      } else if (existing?.password) {
        nextUser.passwordHash = hashPassword(existing.password);
      }
      delete nextUser.password;
      delete nextUser.confirmPassword;
      delete nextUser.hasPassword;
      return nextUser;
    }),
  };
}

function enrichBackup(backup) {
  const { checksum: _checksum, ...withoutChecksum } = backup;
  const normalized = {
    ...withoutChecksum,
    schemaVersion: withoutChecksum.schemaVersion || withoutChecksum.state?.schemaVersion || 1,
    appVersion: withoutChecksum.appVersion || 'unknown',
  };
  return {
    ...normalized,
    checksum: checksum(normalized),
  };
}

function validateBackup(backup) {
  if (!backup || typeof backup !== 'object') return '备份必须是对象';
  if (backup.format !== 'pmo-suite-backup') return '备份格式不正确';
  if (!backup.id || !backup.createdAt || !backup.state) return '备份缺少必要字段';
  const stateError = validateBusinessState(backup.state);
  if (stateError) return `备份状态不正确：${stateError}`;
  if (backup.checksum) {
    const { checksum: _checksum, ...withoutChecksum } = backup;
    if (checksum(withoutChecksum) !== backup.checksum) return '备份 checksum 校验失败';
  }
  return '';
}

function usersComparable(users = []) {
  return JSON.stringify([...users].map(({ password, confirmPassword, passwordHash, hasPassword, ...user }) => ({
    ...user,
    role: normalizeRole(user.role),
  })).sort((a, b) => String(a.id).localeCompare(String(b.id))));
}

function projectForEntity(state, entity, type) {
  if (type === 'projects') return entity;
  if (type === 'sprints') return state.projects.find((project) => project.id === entity.projectId);
  const sprint = state.sprints.find((item) => item.id === entity.sprintId);
  return state.projects.find((project) => project.id === sprint?.projectId);
}

function changedEntities(previous = [], next = []) {
  const previousMap = new Map(previous.map((item) => [item.id, item]));
  const nextMap = new Map(next.map((item) => [item.id, item]));
  const changed = [];
  nextMap.forEach((value, id) => {
    if (JSON.stringify(previousMap.get(id) || null) !== JSON.stringify(value)) changed.push(value);
  });
  previousMap.forEach((value, id) => {
    if (!nextMap.has(id)) changed.push(value);
  });
  return changed;
}

function jsonEqual(left, right) {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

function mergeAuditLogs(baseLogs = [], serverLogs = [], clientLogs = []) {
  const logs = new Map();
  [...baseLogs, ...serverLogs, ...clientLogs].forEach((log) => {
    if (log?.id) logs.set(log.id, log);
  });
  return [...logs.values()]
    .sort((left, right) => String(left.at || '').localeCompare(String(right.at || '')))
    .slice(-100);
}

function mergeObjectFields(baseItem = {}, serverItem = {}, clientItem = {}) {
  const merged = { ...serverItem };
  const conflicts = [];
  const keys = new Set([...Object.keys(baseItem || {}), ...Object.keys(serverItem || {}), ...Object.keys(clientItem || {})]);
  keys.forEach((key) => {
    const baseValue = baseItem?.[key];
    const serverValue = serverItem?.[key];
    const clientValue = clientItem?.[key];
    const serverChanged = !jsonEqual(baseValue, serverValue);
    const clientChanged = !jsonEqual(baseValue, clientValue);
    if (!clientChanged) return;
    if (!serverChanged || jsonEqual(serverValue, clientValue)) {
      if (clientValue === undefined) delete merged[key];
      else merged[key] = clientValue;
      return;
    }
    conflicts.push({ field: key });
  });
  return { item: merged, conflicts };
}

function mergeCollectionById(key, baseState, serverState, clientState) {
  const baseMap = new Map((baseState[key] || []).map((item) => [item.id, item]));
  const serverMap = new Map((serverState[key] || []).map((item) => [item.id, item]));
  const clientMap = new Map((clientState[key] || []).map((item) => [item.id, item]));
  const merged = [];
  const conflicts = [];
  const ids = new Set([...baseMap.keys(), ...serverMap.keys(), ...clientMap.keys()]);

  ids.forEach((id) => {
    const baseItem = baseMap.get(id);
    const serverItem = serverMap.get(id);
    const clientItem = clientMap.get(id);
    const serverChanged = !jsonEqual(baseItem, serverItem);
    const clientChanged = !jsonEqual(baseItem, clientItem);

    if (!clientChanged) {
      if (serverItem) merged.push(serverItem);
      return;
    }
    if (!serverChanged || jsonEqual(serverItem, clientItem)) {
      if (clientItem) merged.push(clientItem);
      return;
    }
    if (!clientItem || !serverItem) {
      conflicts.push({ collection: key, id, reason: '同一数据被一方删除且另一方修改' });
      if (serverItem) merged.push(serverItem);
      return;
    }

    const fieldMerge = mergeObjectFields(baseItem, serverItem, clientItem);
    if (fieldMerge.conflicts.length) {
      conflicts.push({
        collection: key,
        id,
        reason: '同一字段被多人同时修改',
        fields: fieldMerge.conflicts.map((conflict) => conflict.field),
      });
    }
    merged.push(fieldMerge.item);
  });

  return { items: merged, conflicts };
}

export function mergeBusinessState(baseState, serverState, clientState) {
  if (!baseState || typeof baseState !== 'object') {
    return { state: clientState, conflicts: [] };
  }
  const collections = ['users', 'projects', 'sprints', 'requirements', 'milestones', 'timelineNodes'];
  const mergedState = {
    ...serverState,
    view: clientState.view || serverState.view,
    selectedProjectId: clientState.selectedProjectId || serverState.selectedProjectId || '',
    selectedSprintId: clientState.selectedSprintId || serverState.selectedSprintId || '',
    selectedRequirementId: clientState.selectedRequirementId || serverState.selectedRequirementId || '',
    selectedMilestoneId: clientState.selectedMilestoneId || serverState.selectedMilestoneId || '',
    search: clientState.search ?? serverState.search ?? '',
    projectStatus: clientState.projectStatus || serverState.projectStatus || 'all',
    sprintStatus: clientState.sprintStatus || serverState.sprintStatus || 'all',
    auditLogs: mergeAuditLogs(baseState.auditLogs, serverState.auditLogs, clientState.auditLogs),
  };
  const conflicts = [];
  collections.forEach((key) => {
    const result = mergeCollectionById(key, baseState, serverState, clientState);
    mergedState[key] = result.items;
    conflicts.push(...result.conflicts);
  });
  return { state: mergedState, conflicts };
}

export function canSaveState(previousState, nextState, actor) {
  const role = normalizeRole(actor?.role);
  if (role === 'pmo') return { allowed: true };
  if (role === 'member') return { allowed: false, message: '成员仅有查看权限' };
  if (role !== 'pm') return { allowed: false, message: '当前账号无写入权限' };
  if (usersComparable(previousState.users) !== usersComparable(nextState.users)) {
    return { allowed: false, message: 'PM 不能修改系统用户' };
  }
  if ((nextState.projects || []).some((project) => !previousState.projects.some((item) => item.id === project.id))) {
    return { allowed: false, message: 'PM 不能创建项目' };
  }
  const changedCollections = ['projects', 'sprints', 'requirements', 'milestones', 'timelineNodes'];
  for (const key of changedCollections) {
    const changed = changedEntities(previousState[key] || [], nextState[key] || []);
    const outsideScope = changed.some((entity) => projectForEntity(previousState, entity, key)?.owner !== actor.id);
    if (outsideScope) return { allowed: false, message: 'PM 只能修改自己负责项目下的数据' };
  }
  return { allowed: true };
}

function canSaveDeltaInLatestScope(baseState, nextState, latestState, actor) {
  const role = normalizeRole(actor?.role);
  if (role !== 'pm') return { allowed: true };
  const changedCollections = ['projects', 'sprints', 'requirements', 'milestones', 'timelineNodes'];
  for (const key of changedCollections) {
    const changed = changedEntities(baseState[key] || [], nextState[key] || []);
    const outsideScope = changed.some((entity) => {
      const latestProject = projectForEntity(latestState, entity, key);
      const baseProject = projectForEntity(baseState, entity, key);
      return (latestProject || baseProject)?.owner !== actor.id;
    });
    if (outsideScope) return { allowed: false, message: 'PM 只能修改自己负责项目下的数据' };
  }
  return { allowed: true };
}

export function createApp(repository = createRepository(openDatabase())) {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use((request, response, next) => {
    request.requestId = request.headers['x-request-id'] || randomUUID();
    response.setHeader('X-Request-Id', request.requestId);
    const startedAt = Date.now();
    response.on('finish', () => {
      logger.info('request.completed', {
        requestId: request.requestId,
        method: request.method,
        path: request.path,
        status: response.statusCode,
        durationMs: Date.now() - startedAt,
      });
    });
    next();
  });
  app.use((request, response, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      next();
      return;
    }
    const origin = request.headers.origin;
    if (origin) {
      const host = `${request.protocol}://${request.headers.host}`;
      if (origin !== host) {
        response.status(403).json({ error: '跨站请求被拒绝', requestId: request.requestId });
        return;
      }
    }
    next();
  });
  repository.deleteExpiredSessions();

  app.get('/api/health', (_request, response) => {
    const health = repository.healthCheck();
    response.json({
      ok: true,
      storage: 'sqlite',
      version: globalThis.PMO_VERSION || 'local',
      initialized: Boolean(repository.getState()),
      databasePath: repository.databasePath(),
      database: health.ok ? 'writable' : 'unavailable',
      migrations: repository.listMigrations(),
      tableCounts: health.tableCounts,
      uptime: Math.round(process.uptime()),
    });
  });

  app.post('/api/setup', (request, response) => {
    if (repository.getState()) {
      response.status(409).json({ error: '系统已经完成初始化', requestId: request.requestId });
      return;
    }
    const account = String(request.body?.account || '').trim().toLowerCase();
    const name = String(request.body?.name || '').trim();
    const password = String(request.body?.password || '');
    if (!account || !name || !password) {
      response.status(400).json({ error: '初始化需要用户账号、姓名和密码', requestId: request.requestId });
      return;
    }
    const state = createInitialState({ account, name, password });
    const savedState = repository.saveState({
      ...state,
      auditLogs: appendAudit({ ...state, currentUserId: state.users[0].id }, 'system.initialized'),
    });
    const session = createSession(repository, savedState.users[0].id);
    response.setHeader('Set-Cookie', `${sessionCookieName}=${encodeURIComponent(session.token)}; ${cookieOptions(session.expiresAt)}`);
    response.status(201).json({
      ok: true,
      user: sanitizeStateForClient(savedState, savedState.users[0].id).users[0],
      state: sanitizeStateForClient(savedState, savedState.users[0].id),
    });
  });

  app.post('/api/auth/login', (request, response) => {
    const account = String(request.body?.account || '').trim().toLowerCase();
    const password = String(request.body?.password || '');
    const existingState = repository.getState();
    if (!account || !password) {
      logger.warn('auth.login.invalid_input', { requestId: request.requestId, account });
      response.status(400).json({ error: '请输入完整的用户账号和密码', requestId: request.requestId });
      return;
    }
    if (!existingState) {
      response.status(401).json({ error: '系统尚未初始化业务数据', requestId: request.requestId });
      return;
    }
    const state = secureStateForStorage(existingState, existingState);
    const user = state.users.find((item) => item.account === account && item.status === 'active');
    const passwordMatched = user && (verifyPassword(password, user.passwordHash) || user.password === password);
    if (!passwordMatched) {
      logger.warn('auth.login.failed', { requestId: request.requestId, account });
      response.status(401).json({ error: '用户账号或密码不正确，或账号未启用', requestId: request.requestId });
      return;
    }
    const savedState = repository.saveState(state);
    const session = createSession(repository, user.id);
    response.setHeader('Set-Cookie', `${sessionCookieName}=${encodeURIComponent(session.token)}; ${cookieOptions(session.expiresAt)}`);
    response.json({
      ok: true,
      user: sanitizeStateForClient(savedState, user.id).users.find((item) => item.id === user.id),
      state: sanitizeStateForClient(savedState, user.id),
      backups: repository.listBackups(),
    });
  });

  app.post('/api/auth/logout', (request, response) => {
    const token = parseCookies(request.headers.cookie || '')[sessionCookieName];
    if (token) repository.deleteSession(tokenHash(token));
    response.setHeader('Set-Cookie', `${sessionCookieName}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
    response.json({ ok: true });
  });

  app.get('/api/auth/me', (request, response) => {
    const auth = readSession(repository, request);
    if (!auth) {
      response.status(401).json({ error: '未登录', requestId: request.requestId });
      return;
    }
    response.json({
      user: sanitizeStateForClient(auth.state, auth.user.id).users.find((item) => item.id === auth.user.id),
      state: sanitizeStateForClient(auth.state, auth.user.id),
      backups: repository.listBackups(),
    });
  });

  app.get('/api/state', requireAuth(repository), (request, response) => {
    response.json({ state: sanitizeStateForClient(repository.getState(), request.auth.user.id) });
  });

  app.get('/api/users', requireAuth(repository), (request, response) => {
    response.json({ users: sanitizeStateForClient(repository.getState(), request.auth.user.id).users });
  });

  app.get('/api/projects', requireAuth(repository), (request, response) => {
    const state = repository.getState();
    const role = normalizeRole(request.auth.user.role);
    const projects = role === 'pmo'
      ? state.projects
      : state.projects.filter((project) => project.owner === request.auth.user.id || project.members?.includes(request.auth.user.id));
    response.json({ projects });
  });

  app.get('/api/projects/:id/sprints', requireAuth(repository), (request, response) => {
    const state = repository.getState();
    const project = state.projects.find((item) => item.id === request.params.id);
    if (!project) {
      response.status(404).json({ error: '项目不存在', requestId: request.requestId });
      return;
    }
    const role = normalizeRole(request.auth.user.role);
    const canRead = role === 'pmo' || project.owner === request.auth.user.id || project.members?.includes(request.auth.user.id);
    if (!canRead) {
      response.status(403).json({ error: '无权查看该项目 Sprint', requestId: request.requestId });
      return;
    }
    response.json({ sprints: state.sprints.filter((sprint) => sprint.projectId === project.id) });
  });

  app.put('/api/state', (request, response) => {
    const nextState = request.body?.state;
    const error = validateBusinessState(nextState);
    if (error) {
      response.status(400).json({ error, requestId: request.requestId });
      return;
    }
    const existingState = repository.getState();
    const isInitialBootstrap = !existingState;
    const auth = isInitialBootstrap ? null : readSession(repository, request);
    if (!isInitialBootstrap && !auth) {
      response.status(401).json({ error: '未登录或登录已失效', requestId: request.requestId });
      return;
    }
    const baseState = request.body?.baseState;
    const requestRevision = Number(nextState.revision || request.body?.revision || 0);
    const serverRevision = Number(existingState?.revision || 0);
    const securedClientState = secureStateForStorage(nextState, existingState);
    const hasValidBaseState = Boolean(baseState && !validateBusinessState(baseState));
    const securedBaseState = hasValidBaseState
      ? secureStateForStorage(baseState, existingState)
      : existingState;
    const actor = isInitialBootstrap
      ? securedClientState.users.find((user) => normalizeRole(user.role) === 'pmo')
      : existingState.users.find((user) => user.id === auth.user.id);
    if (!isInitialBootstrap) {
      const permission = canSaveState(securedBaseState || existingState, securedClientState, actor);
      if (!permission.allowed) {
        logger.warn('auth.permission.denied', { requestId: request.requestId, actor: actor?.id, message: permission.message });
        response.status(403).json({ error: permission.message, requestId: request.requestId });
        return;
      }
      const latestScopePermission = canSaveDeltaInLatestScope(securedBaseState || existingState, securedClientState, existingState, actor);
      if (!latestScopePermission.allowed) {
        logger.warn('auth.permission.denied', { requestId: request.requestId, actor: actor?.id, message: latestScopePermission.message });
        response.status(403).json({ error: latestScopePermission.message, requestId: request.requestId });
        return;
      }
    }
    const shouldMerge = !isInitialBootstrap && requestRevision !== serverRevision;
    if (shouldMerge && !hasValidBaseState) {
      response.status(409).json({
        error: '数据版本已变化，请刷新后再保存',
        requestId: request.requestId,
        state: sanitizeStateForClient(existingState, actor?.id || ''),
        revision: existingState.revision,
      });
      return;
    }
    const mergeResult = shouldMerge
      ? mergeBusinessState(securedBaseState, existingState, securedClientState)
      : { state: securedClientState, conflicts: [] };
    if (mergeResult.conflicts.length) {
      logger.warn('state.merge.conflict', { requestId: request.requestId, actor: actor?.id, conflicts: mergeResult.conflicts });
      response.status(409).json({
        error: '数据已被他人同时修改，请刷新后基于最新内容重新提交',
        requestId: request.requestId,
        conflicts: mergeResult.conflicts,
        state: sanitizeStateForClient(existingState, actor?.id || ''),
        revision: existingState.revision,
      });
      return;
    }
    const securedState = mergeResult.state;
    const savedState = {
      ...securedState,
      currentUserId: actor?.id || '',
      auditLogs: appendAudit({ ...securedState, currentUserId: actor?.id || '' }, request.body?.event),
    };
    const persisted = repository.saveState({ ...savedState, currentUserId: '' });
    response.json({
      ok: true,
      auditLogs: persisted.auditLogs,
      state: sanitizeStateForClient(persisted, actor?.id || ''),
      revision: persisted.revision,
    });
  });

  app.get('/api/backups', requireAuth(repository), (_request, response) => {
    response.json({ backups: repository.listBackups() });
  });

  app.put('/api/backups', requireAuth(repository), (request, response) => {
    if (normalizeRole(request.auth.user.role) !== 'pmo') {
      response.status(403).json({ error: '只有 PMO 可以保存备份数据', requestId: request.requestId });
      return;
    }
    const backups = request.body?.backups;
    if (!Array.isArray(backups)) {
      response.status(400).json({ error: 'backups 必须是数组', requestId: request.requestId });
      return;
    }
    const enrichedBackups = backups.map(enrichBackup);
    const invalidBackup = enrichedBackups.find((backup) => validateBackup(backup));
    if (invalidBackup) {
      response.status(400).json({ error: validateBackup(invalidBackup), requestId: request.requestId });
      return;
    }
    repository.replaceBackups(enrichedBackups);
    response.json({ ok: true, backups: enrichedBackups });
  });

  app.use(express.static(publicRoot, {
    extensions: ['html'],
    index: 'index.html',
  }));

  app.use((_request, response) => {
    response.sendFile(resolve(publicRoot, 'index.html'));
  });

  app.use((error, request, response, _next) => {
    logger.error('request.failed', {
      requestId: request.requestId,
      method: request.method,
      path: request.path,
      error: error.message,
    });
    response.status(error.status || 500).json({
      error: config.nodeEnv === 'production' ? '服务端错误' : error.message,
      requestId: request.requestId,
    });
  });

  app.locals.repository = repository;
  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repository = createRepository(openDatabase(config.dbPath));
  const app = createApp(repository);
  const server = app.listen(config.port, () => {
    logger.info('server.started', {
      port: config.port,
      dbPath: config.dbPath,
      nodeEnv: config.nodeEnv,
    });
  });

  const shutdown = () => {
    server.close(() => {
      repository.close();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
