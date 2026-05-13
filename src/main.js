const teams = ['产品', '研发', '测试', '设计', '运营', '数据', '安全'];

const roleLabels = {
  pmo: 'PMO',
  pm: 'PM',
  project_owner: 'PM',
  member: '成员',
};

const pinyinMap = {
  张: 'zhang',
  三: 'san',
  李: 'li',
  四: 'si',
  王: 'wang',
  五: 'wu',
  赵: 'zhao',
  敏: 'min',
  陈: 'chen',
  晨: 'chen',
};

const appMeta = window.PMO_META || {
  version: '0.0.0',
  buildDate: 'local',
  dataSchema: 1,
  changelog: [],
};
const authSeedVersion = 1;

const statusLabels = {
  planning: '规划中',
  active: '进行中',
  completed: '已完成',
  paused: '已暂停',
  not_started: '未开始',
  delayed: '延期',
  draft: '待确认',
  confirmed: '已确认',
  in_development: '开发中',
  in_testing: '测试中',
};

const statusTone = {
  planning: 'neutral',
  active: '',
  completed: 'success',
  paused: 'warning',
  not_started: 'neutral',
  delayed: 'danger',
  draft: 'neutral',
  confirmed: '',
  in_development: 'warning',
  in_testing: 'warning',
};

const defaultState = {
  schemaVersion: appMeta.dataSchema,
  authSeedVersion,
  view: 'overview',
  selectedProjectId: 'p-1',
  selectedSprintId: 's-1',
  selectedRequirementId: 'r-1',
  selectedMilestoneId: 'm-1',
  search: '',
  projectStatus: 'all',
  sprintStatus: 'all',
  currentUserId: '',
  loginError: '',
  drawer: null,
  edit: null,
  toast: '',
  users: [
    { id: 'u-1', name: '张三', account: 'zhangsan', email: 'zhangsan@example.com', password: '123456', role: 'pmo', status: 'active' },
    { id: 'u-2', name: '李四', account: 'lisi', email: 'lisi@example.com', password: '123456', role: 'pm', status: 'active' },
    { id: 'u-3', name: '王五', account: 'wangwu', email: 'wangwu@example.com', password: '123456', role: 'member', status: 'active' },
    { id: 'u-4', name: '赵敏', account: 'zhaomin', email: 'zhaomin@example.com', password: '123456', role: 'member', status: 'active' },
  ],
  auditLogs: [],
  projects: [
    {
      id: 'p-1',
      name: '企业客户项目看板',
      description: '项目、Sprint、成员和需求责任人管理。',
      owner: 'u-2',
      members: ['u-1', 'u-2', 'u-3'],
      status: 'active',
      startDate: '2026-05-01',
      endDate: '2026-08-30',
      goal: '让业务和研发团队在同一页面完成项目节奏对齐。',
      teams: ['产品', '研发', '测试'],
      createdAt: '2026-05-01',
      updatedAt: '2026-05-11',
    },
    {
      id: 'p-2',
      name: '财务自动化流程改造',
      description: '优化报销、预算和付款审批链路。',
      owner: 'u-2',
      members: ['u-2', 'u-4'],
      status: 'planning',
      startDate: '2026-06-01',
      endDate: '2026-09-15',
      goal: '缩短财务审批周期，降低人工核对成本。',
      teams: ['产品', '研发', '数据'],
      createdAt: '2026-05-04',
      updatedAt: '2026-05-09',
    },
  ],
  sprints: [
    {
      id: 's-1',
      projectId: 'p-1',
      name: 'Sprint 1 - 项目规划闭环',
      goal: '完成项目和 Sprint 的核心规划链路。',
      description: '覆盖项目 CRUD、Sprint CRUD、关键需求与时间轴设置。',
      owner: 'u-3',
      status: 'active',
      priority: 'high',
      startDate: '2026-05-12',
      endDate: '2026-05-26',
      businessGoal: '项目 Owner 可以独立完成项目计划录入。',
      deliveryGoal: '交付项目管理工作台。',
      qualityGoal: '核心字段完整，时间规则可校验。',
      acceptanceCriteria: '可以创建项目、创建 Sprint，并配置需求、里程碑和时间轴节点。',
      teams: ['产品', '研发', '测试'],
      riskNote: '时间轴拖拽暂不进入第一版。',
      createdAt: '2026-05-10',
      updatedAt: '2026-05-11',
    },
  ],
  milestones: [
    {
      id: 'm-1',
      sprintId: 's-1',
      name: '需求评审完成',
      date: '2026-05-14',
      owner: 'u-1',
      status: 'completed',
      description: '确认项目与 Sprint 的核心字段。',
      deliverable: '需求说明稿',
    },
    {
      id: 'm-2',
      sprintId: 's-1',
      name: '工作台原型确认',
      date: '2026-05-21',
      owner: 'u-2',
      status: 'active',
      description: '完成页面交互确认。',
      deliverable: '单页原型',
    },
  ],
  requirements: [
    {
      id: 'r-1',
      sprintId: 's-1',
      code: 'REQ-001',
      title: '项目增删改查',
      description: '支持项目 Owner 创建、编辑、删除和切换项目。',
      priority: 'P0',
      owner: 'u-1',
      status: 'in_development',
      milestoneId: 'm-2',
      wetaskUrl: 'https://wetask.example.com/requirements/REQ-001',
      expectedDeliveryDate: '2026-05-19',
      acceptanceCriteria: '项目列表和项目详情实时更新。',
    },
    {
      id: 'r-2',
      sprintId: 's-1',
      code: 'REQ-002',
      title: 'Sprint 规划表单',
      description: '支持目标、里程碑、关键需求、时间轴节点设置。',
      priority: 'P0',
      owner: 'u-3',
      status: 'confirmed',
      milestoneId: 'm-2',
      wetaskUrl: 'https://wetask.example.com/requirements/REQ-002',
      expectedDeliveryDate: '2026-05-21',
      acceptanceCriteria: '保存前完成日期范围校验。',
    },
  ],
  timelineNodes: [
    {
      id: 't-1',
      sprintId: 's-1',
      title: 'Sprint 启动会',
      type: 'review',
      date: '2026-05-12',
      owner: 'u-1',
      description: '确认范围、角色和节奏。',
      isCritical: true,
      status: 'completed',
      requirementIds: ['r-1'],
    },
    {
      id: 't-2',
      sprintId: 's-1',
      title: '需求冻结',
      type: 'requirement',
      date: '2026-05-15',
      owner: 'u-1',
      description: '冻结第一版功能范围。',
      isCritical: true,
      status: 'active',
      requirementIds: ['r-1', 'r-2'],
    },
    {
      id: 't-3',
      sprintId: 's-1',
      title: '原型确认',
      type: 'review',
      date: '2026-05-21',
      owner: 'u-2',
      description: '项目 Owner 确认工作台体验。',
      isCritical: true,
      status: 'not_started',
      requirementIds: ['r-2'],
    },
    {
      id: 't-4',
      sprintId: 's-1',
      title: '发布演示',
      type: 'release',
      date: '2026-05-26',
      owner: 'u-3',
      description: '演示完整规划流程。',
      isCritical: true,
      status: 'not_started',
      requirementIds: [],
    },
  ],
};

const storageKey = 'pmo-sprint-api-cache-v2';
const backupStorageKey = 'pmo-sprint-api-backups-v1';
let backupCache = [];
let remoteBaseState = null;
const apiClient = {
  transport: 'rest',
  usesRemote() {
    return typeof window.fetch === 'function' && !['file:', ''].includes(window.location?.protocol || '');
  },
  loadLocalState() {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || 'null');
    } catch {
      return null;
    }
  },
  saveLocalState(serializableState) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(serializableState));
    } catch {
      // Embedded previews can block file:// localStorage writes; keep the UI flow usable.
    }
  },
  loadLocalBackups() {
    try {
      return JSON.parse(window.localStorage.getItem(backupStorageKey) || '[]');
    } catch {
      return [];
    }
  },
  saveLocalBackups(backups) {
    try {
      window.localStorage.setItem(backupStorageKey, JSON.stringify(backups));
    } catch {
      return false;
    }
    return true;
  },
  async bootstrap() {
    backupCache = this.loadLocalBackups();
    if (!this.usesRemote()) return { state: this.loadLocalState(), backups: backupCache };
    try {
      const sessionResponse = await window.fetch('/api/auth/me', { credentials: 'same-origin' });
      if (sessionResponse.ok) {
        const sessionPayload = await sessionResponse.json();
        backupCache = Array.isArray(sessionPayload.backups) ? sessionPayload.backups : [];
        return { state: sessionPayload.state || null, backups: backupCache };
      }

      const healthResponse = await window.fetch('/api/health').catch(() => null);
      const health = healthResponse?.ok ? await healthResponse.json() : {};
      const localState = this.loadLocalState();
      if (!health.initialized && !localState) return { state: null, backups: [], setupRequired: true };
      if (localState) {
        await window.fetch('/api/state', {
          method: 'PUT',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: localState, event: 'data.bootstrap.local', revision: localState.revision }),
        }).catch(() => null);
      }
      return { state: localState, backups: backupCache };
    } catch {
      return { state: this.loadLocalState(), backups: backupCache };
    }
  },
  appendAudit(serializableState, event) {
    return [
      ...(serializableState.auditLogs || []),
      {
        id: uid('audit'),
        at: currentLocalMinute(),
        actor: serializableState.currentUserId || 'system',
        event,
        source: this.usesRemote() ? 'client-pending' : 'local',
      },
    ].slice(-100);
  },
  saveState(nextState, event) {
    const { drawer, edit, toast, ...serializableState } = nextState;
    const auditLogs = this.appendAudit(serializableState, event);
    const nextSerializableState = { ...serializableState, auditLogs };
    this.saveLocalState(nextSerializableState);
    if (this.usesRemote()) this.saveRemoteState(nextSerializableState, event);
    return auditLogs;
  },
  async saveRemoteState(nextState, event) {
    try {
      const response = await window.fetch('/api/state', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: nextState, baseState: remoteBaseState, event, revision: nextState.revision }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'API save failed');
      if (payload.state) {
        applyRemoteStatePayload(payload.state);
        remoteBaseState = cloneSerializableState(payload.state);
        this.saveLocalState(cloneSerializableState(payload.state));
      } else if (Array.isArray(payload.auditLogs)) {
        state.auditLogs = payload.auditLogs;
        if (payload.revision) state.revision = payload.revision;
        const savedState = { ...nextState, revision: payload.revision || nextState.revision, auditLogs: payload.auditLogs };
        remoteBaseState = cloneSerializableState(savedState);
        this.saveLocalState(savedState);
      }
    } catch (error) {
      showToast(`${error.message || '服务端暂不可用'}，已保留浏览器本地副本`);
    }
  },
  async login(account, password) {
    const response = await window.fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, password }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || '登录失败');
    backupCache = Array.isArray(payload.backups) ? payload.backups : [];
    return payload;
  },
  async setup({ account, name, password }) {
    const response = await window.fetch('/api/setup', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, name, password }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || '初始化失败');
    return payload;
  },
  async logout() {
    if (!this.usesRemote()) return;
    try {
      await window.fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } catch {
      // Local logout should not be blocked by a network failure.
    }
  },
  loadBackups() {
    return backupCache;
  },
  saveBackups(backups) {
    backupCache = backups;
    const localSaved = this.saveLocalBackups(backups);
    if (this.usesRemote()) this.saveRemoteBackups(backups);
    return localSaved;
  },
  async saveRemoteBackups(backups) {
    try {
      const response = await window.fetch('/api/backups', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backups }),
      });
      if (!response.ok) throw new Error('API backup save failed');
    } catch {
      showToast('服务端备份暂不可用，已保留浏览器本地副本');
    }
    return true;
  },
};
const state = migrateBusinessState(apiClient.loadLocalState());
const app = document.querySelector('#app');
let pageRegistry = null;
let isBooting = apiClient.usesRemote();

normalizeState();
applyRouteFromHash();

function migrateBusinessState(saved) {
  // Keep business data under a stable storage key; app version changes must not reset user data.
  const base = structuredClone(defaultState);
  if (!saved) return base;
  const migrated = {
    ...base,
    ...saved,
    schemaVersion: appMeta.dataSchema,
    authSeedVersion: saved.authSeedVersion || 0,
    drawer: null,
    edit: null,
    toast: '',
    loginError: '',
  };
  if ((saved.authSeedVersion || 0) < authSeedVersion) {
    migrated.users = migrateSeedUsers(saved.users || []);
    migrated.authSeedVersion = authSeedVersion;
  }
  return migrated;
}

function cloneSerializableState(value) {
  if (!value) return null;
  return structuredClone(value);
}

function applyRemoteStatePayload(remoteState) {
  if (!remoteState) return;
  const preserved = {
    drawer: state.drawer,
    edit: state.edit,
    toast: state.toast,
    loginError: state.loginError,
  };
  const nextState = migrateBusinessState(remoteState);
  Object.assign(state, nextState, preserved);
  normalizeState();
}

function migrateSeedUsers(savedUsers = []) {
  const users = savedUsers.map((user) => ({ ...user }));
  const existingAccounts = new Set(users.map((user) => user.account).filter(Boolean));
  const existingIds = new Set(users.map((user) => user.id).filter(Boolean));
  defaultState.users.forEach((seed) => {
    if (existingAccounts.has(seed.account)) return;
    users.unshift({ ...structuredClone(seed), id: existingIds.has(seed.id) ? `${seed.id}-seed` : seed.id });
  });
  return users;
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeRole(role) {
  if (role === 'project_owner') return 'pm';
  if (['pmo', 'pm', 'member'].includes(role)) return role;
  return 'member';
}

function defaultAccount(name = '') {
  const compact = String(name).trim().toLowerCase().replace(/\s+/g, '');
  const ascii = compact.replace(/[^a-z0-9._-]/g, '');
  if (ascii) return ascii;
  return Array.from(compact).map((char) => pinyinMap[char] || '').join('');
}

function normalizeState() {
  state.users = systemUsers().map((user) => ({
    ...user,
    account: user.account || defaultAccount(user.name),
    name: user.name || user.account || defaultAccount(user.name),
    role: normalizeRole(user.role),
    password: user.password || (user.hasPassword ? '' : '123456'),
    status: user.status || 'active',
  }));
  if (state.currentUserId && !systemUsers().some((user) => user.id === state.currentUserId && user.status === 'active')) {
    state.currentUserId = '';
  }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return map[char];
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function dateText(value) {
  if (!value) return '-';
  return value.slice(5).replace('-', '/');
}

function compactUpdateTime(value = '') {
  const match = String(value).match(/^\d{4}-(\d{2})-(\d{2})\s+(\d{2}:\d{2})/);
  if (!match) return value || '-';
  return `${match[1]}/${match[2]} ${match[3]}`;
}

function badge(status) {
  return `<span class="badge ${statusTone[status] || ''}">${statusLabels[status] || status || '-'}</span>`;
}

function systemUsers() {
  return state.users || [];
}

function userRecord(value) {
  return systemUsers().find((user) => user.id === value || user.name === value);
}

function userName(value) {
  return userRecord(value)?.name || value || '-';
}

function userRole(value) {
  return normalizeRole(userRecord(value)?.role);
}

function currentUser() {
  return userRecord(state.currentUserId);
}

function currentRole() {
  return normalizeRole(currentUser()?.role);
}

function isPmo() {
  return currentRole() === 'pmo';
}

function isPm() {
  return currentRole() === 'pm';
}

function canManageUsers() {
  return isPmo() || isPm();
}

function canCreateProject() {
  return isPmo();
}

function canManageProject(project) {
  return isPmo() || (isPm() && project?.owner === state.currentUserId);
}

function canManageProjectMembers(project) {
  return canManageProject(project);
}

const roleSortOrder = { pmo: 0, pm: 1, member: 2 };

function sortUsersByRole(users = []) {
  return [...users].sort((a, b) => {
    const roleDelta = (roleSortOrder[normalizeRole(a.role)] ?? 9) - (roleSortOrder[normalizeRole(b.role)] ?? 9);
    if (roleDelta) return roleDelta;
    return String(a.account || a.name || '').localeCompare(String(b.account || b.name || ''), 'zh-Hans-CN');
  });
}

function visibleUsers() {
  if (isPmo() || isPm()) return sortUsersByRole(systemUsers());
  return [];
}

function canEditUser() {
  return isPmo();
}

function canDeleteUser(user) {
  return isPmo() && user?.id !== state.currentUserId;
}

function requirePermission(allowed, message = '当前账号无权限执行该操作') {
  if (allowed) return true;
  showToast(message);
  return false;
}

function userOptions(selected = '', allowedUsers = systemUsers()) {
  return allowedUsers.map((user) => `<option value="${user.id}" ${user.id === selected || user.name === selected ? 'selected' : ''}>${user.name} · ${roleLabels[normalizeRole(user.role)]}</option>`).join('');
}

function pmOptions(selected = '') {
  return systemUsers()
    .filter((user) => ['pmo', 'pm'].includes(normalizeRole(user.role)) && user.status === 'active')
    .map((user) => `<option value="${user.id}" ${user.id === selected ? 'selected' : ''}>${user.name} · ${roleLabels[normalizeRole(user.role)]}</option>`)
    .join('');
}

function projectMemberOptions(projectId = state.selectedProjectId, selected = '') {
  const project = state.projects.find((item) => item.id === projectId) || currentProject();
  const members = project?.members?.length ? project.members.map((id) => userRecord(id)).filter(Boolean) : systemUsers();
  return userOptions(selected, members.length ? members : systemUsers());
}

function manageableMemberOptions(selected = '') {
  const users = systemUsers().filter((user) => {
    const role = normalizeRole(user.role);
    if (user.status !== 'active') return false;
    if (isPmo()) return ['pmo', 'pm', 'member'].includes(role);
    return role === 'member';
  });
  return userOptions(selected, users);
}

function teamOptions(selected = []) {
  return teams.map((team) => `<option value="${team}" ${selected.includes(team) ? 'selected' : ''}>${team}</option>`).join('');
}

function projectSprints(projectId = state.selectedProjectId) {
  return state.sprints.filter((sprint) => sprint.projectId === projectId);
}

function currentProject() {
  return state.projects.find((project) => project.id === state.selectedProjectId) || state.projects[0];
}

function currentSprint() {
  const sprint = state.sprints.find((item) => item.id === state.selectedSprintId);
  if (sprint && sprint.projectId === state.selectedProjectId) return sprint;
  return projectSprints()[0];
}

function sprintChildren(sprintId) {
  return {
    milestones: state.milestones.filter((item) => item.sprintId === sprintId),
    requirements: state.requirements.filter((item) => item.sprintId === sprintId),
    timelineNodes: state.timelineNodes.filter((item) => item.sprintId === sprintId),
  };
}

function requirementWetaskUrl(req) {
  if (req.wetaskUrl) return req.wetaskUrl;
  if (!req.code) return '';
  return `https://wetask.example.com/requirements/${encodeURIComponent(req.code)}`;
}

function persistState(event = 'state.saved') {
  const { drawer, edit, toast, ...serializableState } = state;
  state.auditLogs = apiClient.saveState(serializableState, event);
}

function businessSnapshot() {
  const { drawer, edit, toast, loginError, ...snapshot } = state;
  return structuredClone(snapshot);
}

function backupSummary(snapshot) {
  return {
    users: snapshot.users?.length || 0,
    projects: snapshot.projects?.length || 0,
    sprints: snapshot.sprints?.length || 0,
    requirements: snapshot.requirements?.length || 0,
  };
}

function createBackupRecord(snapshot = businessSnapshot()) {
  return {
    format: 'pmo-suite-backup',
    version: 1,
    id: uid('backup'),
    createdAt: currentLocalMinute(),
    createdBy: state.currentUserId,
    summary: backupSummary(snapshot),
    state: snapshot,
  };
}

function dataBackups() {
  return apiClient.loadBackups();
}

function createDataBackup() {
  if (!requirePermission(isPmo(), '只有 PMO 可以备份系统数据')) return;
  const backup = createBackupRecord();
  const backups = [backup, ...dataBackups()].slice(0, 10);
  if (!apiClient.saveBackups(backups)) {
    showToast('备份失败：当前环境无法写入本地备份');
    return;
  }
  showToast('数据备份已创建');
}

function exportDataBackup(id = '') {
  if (!requirePermission(isPmo(), '只有 PMO 可以导出备份数据')) return;
  const backup = dataBackups().find((item) => item.id === id) || dataBackups()[0] || createBackupRecord();
  downloadText(JSON.stringify(backup, null, 2), `pmo-suite-backup-${formatDateTime(backup.createdAt).replace(/[:\s]/g, '-')}.json`, 'application/json');
  showToast('备份文件已导出');
}

function restoreDataBackup(id) {
  if (!requirePermission(isPmo(), '只有 PMO 可以恢复系统数据')) return;
  const backup = dataBackups().find((item) => item.id === id) || dataBackups()[0];
  if (!backup?.state) {
    showToast('暂无可恢复的数据备份');
    return;
  }
  if (!window.confirm(`确认恢复 ${formatDateTime(backup.createdAt)} 的数据备份？当前数据会被备份内容替换。`)) return;
  restoreBackupState(backup.state, 'data.restored');
}

function restoreBackupState(snapshot, event = 'data.restored') {
  const activeUserId = state.currentUserId;
  const restored = migrateBusinessState(snapshot);
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, restored, {
    currentUserId: restored.users?.some((user) => user.id === activeUserId && user.status === 'active') ? activeUserId : restored.currentUserId,
    view: 'dataBackup',
    drawer: null,
    edit: null,
    toast: '',
    loginError: '',
  });
  normalizeState();
  persistState(event);
  showToast('数据已从备份恢复');
}

async function importBackupFile(file) {
  if (!requirePermission(isPmo(), '只有 PMO 可以导入备份数据')) return;
  const parsed = JSON.parse(await file.text());
  const snapshot = parsed.state || parsed;
  if (!snapshot?.users || !snapshot?.projects || !snapshot?.sprints) {
    throw new Error('备份文件格式不正确');
  }
  if (!window.confirm('确认导入备份并恢复？当前数据会被备份内容替换。')) return;
  restoreBackupState(snapshot, 'data.backup.imported');
}

function formatDateTime(value = '') {
  if (!value) return '-';
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(text)) return text.slice(0, 16);
  return text.replace('T', ' ').slice(0, 16);
}

function currentLocalMinute(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function pageContext() {
  return {
    state,
    roleLabels,
    normalizeRole,
    escapeHtml,
    isPmo,
    canManageUsers,
    visibleUsers,
    canEditUser,
    canDeleteUser,
    dataBackups,
    formatDateTime,
    exportDataBackup,
    renderProjectOverview,
    renderSprintPage,
    renderSprintCreatePage,
    renderRequirementPage,
    renderMilestonePage,
    renderAboutPage,
    renderChangelogPage,
    renderSprintEditPage,
  };
}

function pages() {
  if (pageRegistry) return pageRegistry;
  pageRegistry = Object.values(window.PMO_PAGE_FACTORIES || {}).reduce((registry, factory) => ({
    ...registry,
    ...factory(pageContext()),
  }), {});
  return pageRegistry;
}

function renderCurrentPage() {
  const renderer = pages()[state.view];
  if (renderer) return renderer();
  return renderProjectOverview();
}

function routeViews() {
  return new Set(['overview', 'users', 'dataBackup', 'about', 'changelog', 'sprintDetail', 'sprintCreate', 'requirementDetail', 'milestoneDetail', 'sprintEdit', 'sprintEditBasic', 'sprintEditPlan', 'sprintEditRequirements']);
}

function applyRouteFromHash() {
  const view = window.location?.hash?.replace(/^#\/?/, '').split('/')[0];
  if (view && routeViews().has(view)) state.view = view;
}

function syncRouteToHash() {
  if (!window.history?.replaceState || !routeViews().has(state.view)) return;
  const nextHash = `#/${state.view}`;
  if (window.location?.hash !== nextHash) {
    window.history.replaceState(null, '', nextHash);
  }
}

function exportBundle(format = 'csv') {
  const bundle = {
    projects: state.projects,
    users: state.users,
    sprints: state.sprints,
    requirements: state.requirements,
    milestones: state.milestones,
    timelineNodes: state.timelineNodes,
    auditLogs: state.auditLogs,
  };

  if (format === 'xls') {
    const html = `
      <html><head><meta charset="utf-8" /></head><body>
      ${Object.entries(bundle)
        .map(([name, rows]) => `
          <table border="1">
            <tr><th colspan="${rows[0] ? Object.keys(rows[0]).length : 1}">${escapeHtml(name)}</th></tr>
            <tr>${rows[0] ? Object.keys(rows[0]).map((key) => `<th>${escapeHtml(key)}</th>`).join('') : '<th>empty</th>'}</tr>
            ${rows.map((row) => `<tr>${Object.keys(rows[0] || { empty: '' }).map((key) => `<td>${escapeHtml(row?.[key] ?? '')}</td>`).join('')}</tr>`).join('')}
          </table>
        `).join('')}
      </body></html>`;
    downloadText(html, 'pmo-data.xls', 'application/vnd.ms-excel');
    return;
  }

  const csv = serializeBundleCsv(bundle);
  downloadText(csv, 'pmo-data.csv', 'text/csv');
}

function serializeBundleCsv(bundle) {
  return Object.entries(bundle)
    .map(([name, rows]) => {
      const header = rows[0] ? Object.keys(rows[0]) : ['empty'];
      const body = rows.map((row) => header.map((key) => csvCell(row?.[key] ?? '')).join(',')).join('\n');
      return [`#section:${name}`, header.join(','), body].filter(Boolean).join('\n');
    })
    .join('\n\n');
}

function csvCell(value) {
  const text = String(value ?? '').replace(/"/g, '""');
  return `"${text}"`;
}

function downloadText(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importBundle(file) {
  const text = await file.text();
  if (file.name.endsWith('.json')) {
    const parsed = JSON.parse(text);
    applyImportedBundle(parsed);
    return;
  }
  const parsed = parseBundleCsv(text);
  applyImportedBundle(parsed);
}

function parseBundleCsv(text) {
  const sections = {};
  let current = null;
  text.split(/\r?\n/).forEach((line) => {
    if (!line.trim()) return;
    if (line.startsWith('#section:')) {
      current = line.replace('#section:', '').trim();
      sections[current] = [];
      return;
    }
    if (!current) return;
    const rows = sections[current];
    if (!rows.length) {
      rows.push(line.split(',').map((cell) => cell.replace(/^"|"$/g, '').replace(/""/g, '"')));
      return;
    }
    const header = rows[0];
    const values = line.match(/"([^"]*(?:""[^"]*)*)"/g)?.map((cell) => cell.slice(1, -1).replace(/""/g, '"')) || [];
    const obj = {};
    header.forEach((key, index) => {
      obj[key] = values[index] || '';
    });
    rows.push(obj);
  });
  return Object.fromEntries(Object.entries(sections).map(([key, rows]) => [key, rows.slice(1)]));
}

function applyImportedBundle(bundle) {
  const next = {
    projects: (bundle.projects || []).map((project) => ({
      ...project,
      members: splitList(project.members),
      teams: splitList(project.teams),
    })),
    users: bundle.users || state.users,
    sprints: (bundle.sprints || []).map((sprint) => ({
      ...sprint,
      teams: splitList(sprint.teams),
    })),
    requirements: bundle.requirements || [],
    milestones: bundle.milestones || [],
    timelineNodes: (bundle.timelineNodes || []).map((node) => ({
      ...node,
      requirementIds: splitList(node.requirementIds),
      isCritical: node.isCritical === true || node.isCritical === 'true',
    })),
    auditLogs: bundle.auditLogs || [],
  };
  state.projects = next.projects;
  state.users = next.users;
  state.sprints = next.sprints;
  state.requirements = next.requirements;
  state.milestones = next.milestones;
  state.timelineNodes = next.timelineNodes;
  state.auditLogs = next.auditLogs;
  state.selectedProjectId = state.projects[0]?.id || '';
  state.selectedSprintId = projectSprints()[0]?.id || '';
  state.view = 'overview';
  persistState('data.imported');
  render();
}

function splitList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function firstProjectMember(projectId = state.selectedProjectId) {
  const project = state.projects.find((item) => item.id === projectId) || currentProject();
  return project?.members?.[0] || systemUsers()[0]?.id || 'u-1';
}

function filteredProjects() {
  const term = state.search.trim().toLowerCase();
  return state.projects.filter((project) => {
    const matchesAccess = isPmo() || project.owner === state.currentUserId || project.members?.includes(state.currentUserId);
    const matchesStatus = state.projectStatus === 'all' || project.status === state.projectStatus;
    const matchesSprintStatus = state.sprintStatus === 'all' || projectSprints(project.id).some((sprint) => sprint.status === state.sprintStatus);
    const sprintNames = projectSprints(project.id).map((sprint) => sprint.name).join(' ');
    const matchesSearch = !term || `${project.name} ${project.owner} ${project.goal} ${sprintNames}`.toLowerCase().includes(term);
    return matchesAccess && matchesStatus && matchesSprintStatus && matchesSearch;
  });
}

function filteredSprints(projectId) {
  const term = state.search.trim().toLowerCase();
  return projectSprints(projectId).filter((sprint) => {
    const children = sprintChildren(sprint.id);
    const reqText = children.requirements.map((req) => `${req.code} ${req.title}`).join(' ');
    const matchesStatus = state.sprintStatus === 'all' || sprint.status === state.sprintStatus;
    const matchesSearch = !term || `${sprint.name} ${sprint.goal} ${sprint.owner} ${reqText}`.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });
}

function ensureSelection() {
  const projects = filteredProjects();
  const selectedSprint = state.sprints.find((sprint) => sprint.id === state.selectedSprintId);
  if (selectedSprint && projects.some((project) => project.id === selectedSprint.projectId)) {
    state.selectedProjectId = selectedSprint.projectId;
  }
  if (!projects.some((project) => project.id === state.selectedProjectId)) {
    state.selectedProjectId = projects[0]?.id || '';
  }
  const sprint = currentSprint();
  state.selectedSprintId = sprint?.id || '';
}

function render() {
  if (isBooting) {
    app.innerHTML = `
      <main class="login-page">
        <section class="login-card panel">
          <div class="login-brand">
            <div class="system-logo" aria-hidden="true">
              <span class="logo-mark"><i></i><i></i><i></i></span>
            </div>
            <h1>PMO Suite</h1>
          </div>
          <p class="muted">正在连接项目数据服务...</p>
        </section>
      </main>
    `;
    return;
  }
  if (state.setupRequired) {
    app.innerHTML = renderSetupPage();
    return;
  }
  if (!currentUser()) {
    app.innerHTML = renderLoginPage();
    return;
  }
  if (state.view === 'users' && !canManageUsers()) {
    state.view = 'overview';
  }
  if (state.view === 'dataBackup' && !isPmo()) {
    state.view = 'overview';
  }
  ensureSelection();
  const isDrilldown = ['sprintDetail', 'sprintCreate', 'requirementDetail', 'milestoneDetail', 'sprintEdit', 'sprintEditBasic', 'sprintEditPlan', 'sprintEditRequirements'].includes(state.view);
  if (state.currentUserId) syncRouteToHash();

  app.innerHTML = `
    <section class="app-frame ${isDrilldown ? 'drilldown-frame' : ''}">
      ${isDrilldown ? '' : renderSystemSidebar()}
      <section class="workspace">
        ${renderTopbar()}
        ${renderCurrentPage()}
      </section>
    </section>
    ${renderDrawer()}
    <input id="import-file" type="file" accept=".csv,.xls,.xlsx,.json,text/csv,application/json" hidden />
    <input id="backup-file" type="file" accept=".json,application/json" hidden />
    <div class="drawer-backdrop ${state.drawer ? 'open' : ''}" data-action="close-drawer"></div>
    <div class="toast ${state.toast ? 'show' : ''}">${escapeHtml(state.toast)}</div>
  `;
}

function renderLoginPage() {
  return `
    <main class="login-page">
      <section class="login-card panel">
        <div class="login-brand">
          <div class="system-logo" aria-hidden="true">
            <span class="logo-mark"><i></i><i></i><i></i></span>
          </div>
          <h1>PMO Suite</h1>
        </div>
        <form data-form="login" class="login-form" novalidate>
          <div class="field">
            <label>用户账号</label>
            <input name="account" type="text" placeholder="请输入用户账号" autocomplete="username" />
          </div>
          <div class="field">
            <label>密码</label>
            <input name="password" type="password" placeholder="请输入密码" autocomplete="current-password" />
          </div>
          ${state.loginError ? `<p class="login-error">${escapeHtml(state.loginError)}</p>` : ''}
          <button class="button primary" type="submit">登录</button>
        </form>
      </section>
    </main>
  `;
}

function renderSetupPage() {
  return `
    <main class="login-page">
      <section class="login-card panel">
        <div class="login-brand">
          <div class="system-logo" aria-hidden="true">
            <span class="logo-mark"><i></i><i></i><i></i></span>
          </div>
          <h1>PMO Suite</h1>
        </div>
        <form data-form="setup" class="login-form" novalidate>
          <div class="field">
            <label>PMO 用户账号</label>
            <input name="account" type="text" placeholder="例如 zhangsan" autocomplete="username" required />
          </div>
          <div class="field">
            <label>姓名</label>
            <input name="name" type="text" placeholder="请输入管理员姓名" required />
          </div>
          <div class="field">
            <label>登录密码</label>
            <input name="password" type="password" placeholder="请设置初始化密码" autocomplete="new-password" required />
          </div>
          ${state.loginError ? `<p class="login-error">${escapeHtml(state.loginError)}</p>` : ''}
          <button class="button primary" type="submit">初始化系统</button>
        </form>
      </section>
    </main>
  `;
}

function renderSystemSidebar() {
  const activeProjects = state.projects.filter((project) => project.status === 'active').length;
  const user = currentUser();
  const userInitial = user?.name?.slice(0, 1) || 'U';
  const latestUpdateTime = compactUpdateTime(appMeta.changelog?.[0]?.date || appMeta.buildDate);
  return `
    <aside class="system-sidebar">
      <div class="system-brand">
        <div class="system-logo" aria-hidden="true">
          <span class="logo-mark"><i></i><i></i><i></i></span>
        </div>
        <div>
          <strong>PMO Suite</strong>
          <span>Delivery Office</span>
        </div>
      </div>
      <nav class="system-nav" aria-label="系统菜单">
        <p>工作台</p>
        <button class="system-nav-item ${state.view === 'overview' ? 'active' : ''}" data-action="open-overview">项目总览 <span>${state.projects.length}</span></button>
        ${canManageUsers() ? `<button class="system-nav-item ${state.view === 'users' ? 'active' : ''}" data-action="open-users">成员管理 <span>${visibleUsers().length}</span></button>` : ''}
        ${isPmo() ? `<button class="system-nav-item ${state.view === 'dataBackup' ? 'active' : ''}" data-action="open-data-backup">数据备份 <span>${dataBackups().length}</span></button>` : ''}
      </nav>
      <div class="system-sidebar-foot">
        <div class="sidebar-user">
          <div class="sidebar-avatar">${escapeHtml(userInitial)}</div>
          <div>
            <strong>${escapeHtml(user?.account || '-')}</strong>
            <span>${roleLabels[currentRole()]} · ${escapeHtml(user?.name || user?.account || '-')}</span>
          </div>
        </div>
        <div class="sidebar-session-row">
          <span>已登录</span>
          <button class="sidebar-inline-action" data-action="logout">退出</button>
        </div>
        <button class="sidebar-meta-trigger ${state.view === 'about' ? 'active' : ''}" data-action="open-info-page" data-view="about">
          <span>关于我们</span><strong>v${escapeHtml(appMeta.version)}</strong>
        </button>
        <button class="sidebar-meta-trigger ${state.view === 'changelog' ? 'active' : ''}" data-action="open-info-page" data-view="changelog">
          <span>更新日志</span><strong>${escapeHtml(latestUpdateTime)}</strong>
        </button>
      </div>
    </aside>
  `;
}

function renderAboutPage() {
  return `
    <main class="project-overview info-page">
      <section class="panel hero info-page-hero">
        <div class="hero-content">
          <div class="hero-title">
            <div>
              <p class="eyebrow">PMO Suite</p>
              <h2>关于我们</h2>
              <p class="muted">致力于打造多 Agent 协同的 AI Native 项目管理系统。</p>
            </div>
            <button class="button" data-action="open-overview">返回工作台</button>
          </div>
          <div class="about-hero">
            <span class="system-logo" aria-hidden="true"><span class="logo-mark"><i></i><i></i><i></i></span></span>
            <div>
              <h3>PMO Suite</h3>
              <p>版本 ${escapeHtml(appMeta.version)} · 更新 ${escapeHtml(appMeta.buildDate)}</p>
            </div>
          </div>
        </div>
      </section>
      <section class="panel card about-position-card">
        <div class="section-head">
          <div>
            <h2>产品定位</h2>
          </div>
        </div>
        <div class="info-block">
          <strong>未来规划</strong>
              <p>PMO Suite 面向 PMO、项目 PM 和项目成员，提供完整的项目交付管理工作台；未来将围绕多 Agent 协同、AI Native 计划生成、风险识别、进度洞察和自动化项目复盘持续演进。</p>
        </div>
        <div class="info-feature-grid">
          <span>项目与 Sprint 管理</span>
          <span>系统级用户与权限</span>
          <span>需求责任人与 WeTask 链接</span>
          <span>计划、里程碑与时间轴</span>
          <span>CSV / Excel 导入导出</span>
          <span>本地业务数据保护</span>
        </div>
      </section>
    </main>
  `;
}

function renderChangelogPage() {
  const entries = appMeta.changelog || [];
  return `
    <main class="project-overview info-page">
      <section class="panel hero info-page-hero">
        <div class="hero-content">
          <div class="hero-title">
            <div>
              <p class="eyebrow">PMO Suite</p>
              <h2>更新日志</h2>
              <p class="muted">当前版本 ${escapeHtml(appMeta.version)} · 最近更新 ${escapeHtml(appMeta.buildDate)}</p>
            </div>
            <button class="button" data-action="open-overview">返回工作台</button>
          </div>
        </div>
      </section>
      <section class="panel card">
        <div class="section-head">
          <div>
            <h2>版本更新</h2>
          </div>
          <span class="badge neutral">${entries.length} 条</span>
        </div>
        <div class="changelog-panel">
          ${entries.length ? entries.map((item) => `
            <article class="changelog-item">
              <time>${escapeHtml(item.date || '-')}</time>
              <div>
                <strong>版本 ${escapeHtml(item.version || appMeta.version)} · ${escapeHtml(item.date || '-')}</strong>
                <ul>
                  ${(item.points?.length ? item.points : [item.message || '系统更新']).map((point) => `<li>${escapeHtml(point)}</li>`).join('')}
                </ul>
              </div>
            </article>
          `).join('') : '<div class="timeline-empty">暂无更新日志</div>'}
        </div>
      </section>
    </main>
  `;
}

function renderTopbar() {
  const breadcrumbLabel = {
    sprintDetail: 'Sprint Detail',
    sprintCreate: 'Create Sprint',
    sprintEdit: 'Edit Sprint',
    sprintEditBasic: 'Edit Sprint',
    sprintEditPlan: 'Edit Plan',
    sprintEditRequirements: 'Edit Requirements',
    users: 'Users',
    dataBackup: 'Data Backup',
    about: 'About',
    changelog: 'Changelog',
    requirementDetail: 'Requirement',
    milestoneDetail: 'Milestone',
    overview: 'Dashboard',
  }[state.view] || 'Dashboard';
  return `
    <header class="topbar">
      <div>
        <p class="breadcrumb">PMO / ${breadcrumbLabel}</p>
      </div>
      <div class="toolbar">
        <input class="control" data-action="search" value="${escapeHtml(state.search)}" placeholder="搜索项目、Sprint、需求" />
        <details class="toolbar-menu">
          <summary class="button">筛选</summary>
          <div class="toolbar-menu-panel">
            <label>项目状态</label>
            <select class="control" data-action="project-filter">
              <option value="all" ${state.projectStatus === 'all' ? 'selected' : ''}>全部项目</option>
              <option value="planning" ${state.projectStatus === 'planning' ? 'selected' : ''}>规划中</option>
              <option value="active" ${state.projectStatus === 'active' ? 'selected' : ''}>进行中</option>
              <option value="completed" ${state.projectStatus === 'completed' ? 'selected' : ''}>已完成</option>
              <option value="paused" ${state.projectStatus === 'paused' ? 'selected' : ''}>已暂停</option>
            </select>
            <label>Sprint 状态</label>
            <select class="control" data-action="sprint-filter">
              <option value="all" ${state.sprintStatus === 'all' ? 'selected' : ''}>全部 Sprint</option>
              <option value="not_started" ${state.sprintStatus === 'not_started' ? 'selected' : ''}>未开始</option>
              <option value="active" ${state.sprintStatus === 'active' ? 'selected' : ''}>进行中</option>
              <option value="completed" ${state.sprintStatus === 'completed' ? 'selected' : ''}>已完成</option>
              <option value="delayed" ${state.sprintStatus === 'delayed' ? 'selected' : ''}>延期</option>
            </select>
          </div>
        </details>
        <details class="toolbar-menu">
          <summary class="button">更多</summary>
          <div class="toolbar-menu-panel compact">
            <button class="link-button" data-action="export-csv">导出 CSV</button>
            <button class="link-button" data-action="export-xls">导出 Excel</button>
            <button class="link-button" data-action="import-data">导入</button>
          </div>
        </details>
        ${canCreateProject() ? '<button class="button" data-action="new-project">+ 新建项目</button>' : ''}
      </div>
    </header>
  `;
}

function renderSidebar() {
  const projects = filteredProjects();
  return `
    <aside class="panel sidebar">
      <div class="section-head">
        <div>
          <h2>项目列表</h2>
          <p class="small">共 ${projects.length} 个项目</p>
        </div>
      </div>
      <div class="project-list">
        ${projects.length ? projects.map(renderProjectCard).join('') : '<div class="empty-state">暂无匹配项目</div>'}
      </div>
    </aside>
  `;
}

function renderProjectOverview() {
  const projects = filteredProjects();
  return `
    <main class="project-overview">
      <section class="project-dashboard-list">
        ${projects.length ? projects.map(renderProjectDashboardCard).join('') : '<div class="panel empty-state">暂无匹配项目</div>'}
      </section>
    </main>
  `;
}

function renderProjectDashboardCard(project) {
  const allSprints = projectSprints(project.id).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const visibleSprints = filteredSprints(project.id);
  const activeSprint = allSprints.find((sprint) => sprint.status === 'active');
  const otherSprints = visibleSprints.filter((sprint) => sprint.id !== activeSprint?.id);
  const requirementsCount = allSprints.reduce((sum, sprint) => sum + sprintChildren(sprint.id).requirements.length, 0);
  const delayedCount = allSprints.filter((sprint) => sprint.status === 'delayed').length;
  const memberCount = project.members?.length || 0;
  const canManage = canManageProject(project);

  return `
    <article class="project-shell panel">
      <section class="project-panel">
        <div class="project-panel-head">
          <div class="project-title-block">
            <div class="rail-mark">${project.name.slice(0, 1)}</div>
            <div>
              <div class="project-name-row">
                <h3>${escapeHtml(project.name)}</h3>
                ${badge(project.status)}
                ${delayedCount ? `<span class="danger-text">${delayedCount} 个延期</span>` : ''}
              </div>
              <p class="project-summary">${escapeHtml(project.description || project.goal)}</p>
            </div>
          </div>
          <div class="card-actions">
            ${canManage ? `<button class="button" data-action="edit-project" data-id="${project.id}">编辑项目</button>` : ''}
            ${canManage ? `<button class="button" data-action="new-sprint" data-id="${project.id}">+ Sprint</button>` : ''}
            ${isPmo() ? `
            <details class="advanced-menu">
              <summary aria-label="高级操作">•••</summary>
              <div class="advanced-menu-panel">
                <button class="link-button danger" data-action="delete-project" data-id="${project.id}">删除项目</button>
              </div>
            </details>
            ` : ''}
          </div>
        </div>
        <div class="project-compact-meta">
          <div><span>Owner</span><strong>${escapeHtml(userName(project.owner))}</strong></div>
          <div><span>项目周期</span><strong>${dateText(project.startDate)} - ${dateText(project.endDate)}</strong></div>
          <div><span>Sprint</span><strong>${allSprints.length} 个</strong></div>
          <div><span>成员</span><strong>${memberCount} 个</strong></div>
          <div><span>需求</span><strong>${requirementsCount} 条</strong></div>
        </div>
        ${activeSprint ? renderActiveSprint(activeSprint) : renderNoActiveSprint(project)}
        <div class="other-sprints">
          <div class="section-head compact">
            <h3>其他 Sprint</h3>
            <span class="small">${otherSprints.length} 个</span>
          </div>
          <div class="sprint-row-list">
            ${otherSprints.length ? otherSprints.map(renderSprintRow).join('') : '<div class="timeline-empty">暂无其他 Sprint</div>'}
          </div>
        </div>
      </section>
    </article>
  `;
}

function renderActiveSprint(sprint) {
  const children = sprintChildren(sprint.id);
  const project = state.projects.find((item) => item.id === sprint.projectId);
  const canManage = canManageProject(project);
  return `
    <section class="active-sprint-card" data-action="open-sprint" data-id="${sprint.id}" tabindex="0">
      <div class="active-sprint-copy">
        <div class="card-title-row">
          <div>
            <p class="eyebrow">当前进行中 Sprint</p>
            <h3>${escapeHtml(sprint.name)}</h3>
          </div>
          ${badge(sprint.status)}
        </div>
        <p>${escapeHtml(sprint.goal)}</p>
      </div>
      <div class="active-sprint-metrics">
        <div><span>周期</span><strong>${dateText(sprint.startDate)} - ${dateText(sprint.endDate)}</strong></div>
        <div><span>需求</span><strong>${children.requirements.length} 条</strong></div>
        <div><span>里程碑</span><strong>${children.milestones.length} 个</strong></div>
      </div>
      <div class="card-actions">
        <button class="link-button" data-action="open-sprint" data-id="${sprint.id}">进入详情</button>
        ${canManage ? `<button class="link-button" data-action="edit-sprint" data-id="${sprint.id}">编辑</button>` : ''}
      </div>
    </section>
  `;
}

function renderNoActiveSprint(project) {
  return `
    <section class="active-sprint-card empty-active">
      <div>
        <p class="eyebrow">当前进行中 Sprint</p>
        <h3>暂无进行中的 Sprint</h3>
        <p class="small">可以从下方列表进入已有 Sprint，或新建一个 Sprint。</p>
      </div>
      ${canManageProject(project) ? `<button class="button primary" data-action="new-sprint" data-id="${project.id}">+ 新建 Sprint</button>` : ''}
    </section>
  `;
}

function renderSprintRow(sprint) {
  const children = sprintChildren(sprint.id);
  const project = state.projects.find((item) => item.id === sprint.projectId);
  return `
    <div class="sprint-row" data-action="open-sprint" data-id="${sprint.id}" tabindex="0">
      <div>
        <strong>${escapeHtml(sprint.name)}</strong>
        <p class="small">${dateText(sprint.startDate)} - ${dateText(sprint.endDate)} · ${children.requirements.length} 条需求 · ${children.milestones.length} 个里程碑</p>
      </div>
      <div class="sprint-row-actions">
        ${badge(sprint.status)}
        ${canManageProject(project) ? `<button class="link-button" data-action="edit-sprint" data-id="${sprint.id}">编辑</button>` : ''}
      </div>
    </div>
  `;
}

function renderMain(project) {
  const sprints = filteredSprints(project.id);
  const delayedCount = sprints.filter((sprint) => sprint.status === 'delayed').length;
  return `
    <main class="main">
      <section class="panel card">
        <div class="section-head">
          <div>
            <h2>Sprint 管理</h2>
            <p class="small">当前项目下的 Sprint 列表。单击 Sprint 进入二级详情页。</p>
          </div>
          <span class="badge ${delayedCount ? 'danger' : 'success'}">${delayedCount ? `${delayedCount} 个延期` : '节奏正常'}</span>
        </div>
        <div class="sprint-list overview-sprint-list">
          ${sprints.length ? sprints.map(renderSprintCard).join('') : '<div class="empty-state">暂无 Sprint，点击「新建 Sprint」开始规划。</div>'}
        </div>
      </section>
    </main>
  `;
}

function renderSprintCard(sprint) {
  const children = sprintChildren(sprint.id);
  return `
    <article class="sprint-card ${sprint.id === state.selectedSprintId ? 'active' : ''}" data-action="open-sprint" data-id="${sprint.id}" tabindex="0">
      <div class="card-title-row">
        <div>
          <h3>${escapeHtml(sprint.name)}</h3>
        <p class="small">${dateText(sprint.startDate)} - ${dateText(sprint.endDate)} · Owner ${escapeHtml(userName(sprint.owner))}</p>
        </div>
        ${badge(sprint.status)}
      </div>
      <div class="goal-box">${escapeHtml(sprint.goal)}</div>
      <div class="meta-grid">
        <div class="meta-item"><span>里程碑</span><strong>${children.milestones.length} 个</strong></div>
        <div class="meta-item"><span>需求</span><strong>${children.requirements.length} 条</strong></div>
        <div class="meta-item"><span>时间节点</span><strong>${children.timelineNodes.length} 个</strong></div>
        <div class="meta-item"><span>优先级</span><strong>${sprint.priority || '-'}</strong></div>
      </div>
      <div class="card-actions" style="margin-top: 14px;">
        <button class="link-button" data-action="open-sprint" data-id="${sprint.id}">进入详情</button>
        <button class="link-button" data-action="edit-sprint" data-id="${sprint.id}">编辑</button>
        <button class="link-button danger" data-action="delete-sprint" data-id="${sprint.id}">删除</button>
      </div>
    </article>
  `;
}

function renderSprintPage() {
  const sprint = currentSprint();
  const project = currentProject();
  if (!sprint || !project) {
    state.view = 'overview';
    return '';
  }

  return `
    <section class="detail-page">
      <div class="detail-nav">
        <button class="button" data-action="back-overview">← 返回项目 Sprint 列表</button>
        <div class="small">当前项目：${escapeHtml(project.name)}</div>
      </div>
      ${renderSprintDetail(sprint)}
    </section>
  `;
}

function renderSprintCreatePage() {
  const project = currentProject();
  if (!project || !canManageProject(project)) {
    state.view = 'overview';
    return '';
  }
  if (state.edit?.type !== 'sprint-create' || state.edit.draft?.projectId !== project.id) {
    state.edit = { type: 'sprint-create', step: 'basic', draft: createSprintDraft(project.id) };
  }
  const draft = state.edit.draft;
  const step = state.edit.step || 'basic';
  return `
    <section class="detail-page">
      <div class="detail-nav">
        <button class="button" data-action="cancel-sprint-create">← 返回项目 Sprint 列表</button>
        <div class="small">当前项目：${escapeHtml(project.name)}</div>
      </div>
      <section class="panel hero sprint-hero edit-hero">
        <div class="hero-content">
          <div class="hero-title">
            <div>
              <p class="eyebrow">Sprint 创建向导</p>
              <h2>新建 Sprint</h2>
              <p class="muted">按步骤录入基础信息、计划与里程碑、关键需求。</p>
            </div>
          </div>
          ${renderSprintWizard(step, draft)}
        </div>
      </section>
    </section>
  `;
}

function createSprintDraft(projectId = state.selectedProjectId) {
  const project = state.projects.find((item) => item.id === projectId) || currentProject();
  return {
    id: uid('s'),
    projectId,
    name: '',
    goal: '',
    description: '',
    owner: firstProjectMember(projectId),
    status: 'not_started',
    priority: 'medium',
    startDate: project?.startDate || today(),
    endDate: project?.endDate || today(),
    businessGoal: '',
    deliveryGoal: '',
    qualityGoal: '',
    acceptanceCriteria: '',
    teams: ['产品', '研发'],
    riskNote: '',
    createdAt: today(),
    updatedAt: today(),
    requirements: [],
    milestones: [],
    timelineNodes: [],
  };
}

function renderSprintWizard(step, draft, mode = 'create') {
  const steps = [
    ['basic', '基础信息'],
    ['plan', '计划与里程碑'],
    ['requirements', '关键需求'],
  ];
  const isEdit = mode === 'edit';
  const submitLabel = isEdit ? '保存 Sprint' : '创建 Sprint';
  const cancelAction = isEdit ? 'cancel-sprint-edit' : 'cancel-sprint-create';
  const stepActionPrefix = isEdit ? 'sprint-edit' : 'sprint-create';
  return `
    <form data-form="${isEdit ? 'sprint-edit' : 'sprint-create'}" class="edit-page-form wizard-form" novalidate>
      <div class="wizard-steps">
        ${steps.map(([key, label], index) => `<button type="button" class="wizard-step ${step === key ? 'active' : ''}" data-action="${stepActionPrefix}-step" data-step="${key}"><span>${index + 1}</span>${label}</button>`).join('')}
      </div>
      <div class="wizard-panel ${step === 'basic' ? 'active' : ''}">
        <div class="form-grid">
          ${hiddenField('id', draft.id)}
          ${hiddenField('projectId', draft.projectId)}
          ${field('Sprint 名称', 'name', draft.name, 'text', true)}
          ${selectField('Sprint Owner', 'owner', projectMemberOptions(draft.projectId, draft.owner), false, true)}
          ${selectField('Sprint 状态', 'status', sprintStatusOptions(draft.status), false, true)}
          ${selectField('优先级', 'priority', priorityOptions(draft.priority), false, true)}
          ${field('开始日期', 'startDate', draft.startDate, 'date', true)}
          ${field('结束日期', 'endDate', draft.endDate, 'date', true)}
          ${textareaField('Sprint 描述', 'description', draft.description)}
          ${textareaField('Sprint 目标', 'goal', draft.goal, true)}
          ${textareaField('验收标准', 'acceptanceCriteria', draft.acceptanceCriteria)}
          ${textareaField('风险说明', 'riskNote', draft.riskNote)}
        </div>
      </div>
      <div class="wizard-panel ${step === 'plan' ? 'active' : ''}">
        ${renderRepeatSection('milestones', '里程碑', draft.milestones || [], renderMilestoneForm)}
        ${renderRepeatSection('timelineNodes', '时间轴节点', draft.timelineNodes || [], renderTimelineNodeForm)}
      </div>
      <div class="wizard-panel ${step === 'requirements' ? 'active' : ''}">
        ${renderRepeatSection('requirements', '关键需求', draft.requirements || [], renderRequirementForm)}
      </div>
      <div class="edit-page-footer">
        <button type="button" class="button" data-action="${cancelAction}">取消</button>
        ${step !== 'basic' ? `<button type="button" class="button" data-action="${stepActionPrefix}-prev">上一步</button>` : ''}
        ${step !== 'requirements' ? `<button type="button" class="button primary" data-action="${stepActionPrefix}-next">下一步</button>` : `<button type="submit" class="button primary">${submitLabel}</button>`}
      </div>
    </form>
  `;
}

function renderSprintDetail(sprint) {
  const { milestones, requirements, timelineNodes } = sprintChildren(sprint.id);
  const project = state.projects.find((item) => item.id === sprint.projectId);
  const canManage = canManageProject(project);
  return `
    <section class="panel hero sprint-hero">
      <div class="hero-content">
        <div class="hero-title">
          <div>
            <p class="eyebrow">${escapeHtml(project?.name || 'Sprint')}</p>
            <div class="sprint-title-row">
              <h2>${escapeHtml(sprint.name)}</h2>
              ${badge(sprint.status)}
            </div>
            <p class="muted">${escapeHtml(sprint.description || sprint.goal)}</p>
          </div>
          <div class="hero-actions">
            ${canManage ? `<button class="button" data-action="edit-sprint" data-step="basic" data-id="${sprint.id}">编辑 Sprint</button>` : ''}
            ${canManage ? `<button class="button danger" data-action="delete-sprint" data-id="${sprint.id}">删除 Sprint</button>` : ''}
          </div>
        </div>
        <div class="summary-grid">
          <div class="summary-card"><span>Sprint Owner</span><strong>${escapeHtml(userName(sprint.owner))}</strong></div>
          <div class="summary-card"><span>Sprint 周期</span><strong>${dateText(sprint.startDate)} - ${dateText(sprint.endDate)}</strong></div>
          <div class="summary-card"><span>优先级</span><strong>${escapeHtml(sprint.priority || '-')}</strong></div>
        </div>
        <div class="goal-box sprint-goal-box">
          <strong>目标：</strong>${escapeHtml(sprint.goal)}<br />
          <strong>验收：</strong>${escapeHtml(sprint.acceptanceCriteria || '暂未填写')}
          ${sprint.riskNote ? `<br /><strong>风险：</strong>${escapeHtml(sprint.riskNote)}` : ''}
        </div>
      </div>
    </section>
    <section class="panel card plan-card">
      <div class="section-head">
        <div>
          <h2>计划与里程碑</h2>
          <p class="small">时间轴和里程碑在同一卡片中配置与查看。</p>
        </div>
        ${canManage ? `<div class="card-actions">
          <button class="button" data-action="edit-sprint" data-step="plan" data-add="milestones" data-id="${sprint.id}">+ 里程碑</button>
          <button class="button" data-action="edit-sprint" data-step="plan" data-add="timelineNodes" data-id="${sprint.id}">+ 时间节点</button>
        </div>` : ''}
      </div>
      ${renderTimeline(sprint, timelineNodes)}
      <div class="subsection-label">
        <span>里程碑清单</span>
        <strong>${milestones.length} 个</strong>
      </div>
      <div class="milestone-strip">
        ${milestones.length ? milestones.map(renderMilestone).join('') : '<div class="timeline-empty">暂无里程碑，点击右上角按钮添加。</div>'}
      </div>
    </section>
    <section class="panel card">
      <div class="section-head">
        <div>
          <h2>关键需求</h2>
          <p class="small">需求详情与 WeTask 链接可在 Sprint 编辑中维护。</p>
        </div>
        <div class="card-actions">
          <span class="small">${requirements.length} 条</span>
          ${canManage ? `<button class="button" data-action="edit-sprint" data-step="requirements" data-id="${sprint.id}">维护需求链接</button>` : ''}
        </div>
      </div>
      <div class="mini-list">
        ${requirements.length ? requirements.map(renderRequirement).join('') : '<div class="timeline-empty">暂无关键需求</div>'}
      </div>
    </section>
  `;
}

function renderSprintEditPage() {
  const sprint = currentSprint();
  const project = currentProject();
  const stepMap = {
    sprintEdit: 'basic',
    sprintEditBasic: 'basic',
    sprintEditPlan: 'plan',
    sprintEditRequirements: 'requirements',
  };
  const editStep = state.edit?.step || stepMap[state.view] || 'basic';
  if (!sprint || !project || !canManageProject(project)) {
    state.view = 'sprintDetail';
    return '';
  }
  if (!state.edit?.draft || state.edit.draft.id !== sprint.id || state.edit.type !== 'sprint-edit') {
    state.edit = { type: 'sprint-edit', step: editStep, draft: sprintEditDraft(sprint) };
  }
  state.edit.step = editStep;
  const draft = state.edit.draft;
  return `
    <section class="detail-page">
      <div class="detail-nav">
        <button class="button" data-action="cancel-sprint-edit">← 返回 Sprint</button>
        <div class="small">当前项目：${escapeHtml(project.name)}</div>
      </div>
      <section class="panel hero sprint-hero edit-hero">
        <div class="hero-content">
          <div class="hero-title">
            <div>
              <p class="eyebrow">Sprint 编辑向导</p>
              <div class="sprint-title-row">
                <h2>编辑 Sprint</h2>
                ${badge(sprint.status)}
              </div>
              <p class="muted">按与创建一致的步骤维护基础信息、计划与里程碑、关键需求。</p>
            </div>
          </div>
          ${renderSprintWizard(editStep, draft, 'edit')}
        </div>
      </section>
    </section>
  `;
}

function sprintEditDraft(sprint) {
  const childData = sprintChildren(sprint.id);
  return {
    ...structuredClone(sprint),
    milestones: structuredClone(childData.milestones),
    requirements: structuredClone(childData.requirements),
    timelineNodes: structuredClone(childData.timelineNodes),
  };
}

function renderRequirementPage() {
  const req = state.requirements.find((item) => item.id === state.selectedRequirementId);
  const sprint = state.sprints.find((item) => item.id === req?.sprintId);
  const project = state.projects.find((item) => item.id === sprint?.projectId);
  if (!req || !sprint) {
    state.view = 'sprintDetail';
    return '';
  }
  const wetaskUrl = requirementWetaskUrl(req);
  return `
    <section class="detail-page">
      <div class="detail-nav">
        <button class="button" data-action="back-sprint" data-id="${sprint.id}">← 返回 Sprint</button>
        <div class="small">${escapeHtml(sprint.name)}</div>
      </div>
      <section class="panel hero">
        <div class="hero-content">
          <div class="hero-title">
            <div>
              <p class="eyebrow">${escapeHtml(req.code)}</p>
              <h2>${escapeHtml(req.title)}</h2>
              <p class="muted">${escapeHtml(req.description || '暂无描述')}</p>
            </div>
            ${canManageProject(project) ? `<button class="button" data-action="edit-sprint" data-step="requirements" data-id="${sprint.id}">编辑需求</button>` : ''}
          </div>
          <div class="summary-grid">
            <div class="summary-card"><span>负责人</span><strong>${escapeHtml(userName(req.owner))}</strong></div>
            <div class="summary-card"><span>状态</span><strong>${statusLabels[req.status]}</strong></div>
            <div class="summary-card"><span>优先级</span><strong>${req.priority}</strong></div>
            <div class="summary-card"><span>交付时间</span><strong>${dateText(req.expectedDeliveryDate)}</strong></div>
          </div>
          <div class="goal-box sprint-goal-box">
            <strong>验收标准：</strong>${escapeHtml(req.acceptanceCriteria || '暂未填写')}
          </div>
          <div class="detail-link-row">
            ${wetaskUrl ? `<a class="button" href="${escapeHtml(wetaskUrl)}" target="_blank" rel="noreferrer">打开 WeTask 需求</a>` : '<span class="small">未绑定 WeTask 需求链接</span>'}
          </div>
        </div>
      </section>
    </section>
  `;
}

function renderMilestonePage() {
  const milestone = state.milestones.find((item) => item.id === state.selectedMilestoneId);
  const sprint = state.sprints.find((item) => item.id === milestone?.sprintId);
  const project = state.projects.find((item) => item.id === sprint?.projectId);
  if (!milestone || !sprint) {
    state.view = 'sprintDetail';
    return '';
  }
  return `
    <section class="detail-page">
      <div class="detail-nav">
        <button class="button" data-action="back-sprint" data-id="${sprint.id}">← 返回 Sprint</button>
        <div class="small">${escapeHtml(sprint.name)}</div>
      </div>
      <section class="panel hero">
        <div class="hero-content">
          <div class="hero-title">
            <div>
              <p class="eyebrow">Milestone</p>
              <h2>${escapeHtml(milestone.name)}</h2>
              <p class="muted">${escapeHtml(milestone.description || '暂无描述')}</p>
            </div>
            ${canManageProject(project) ? `<button class="button" data-action="edit-sprint" data-step="plan" data-id="${sprint.id}">编辑里程碑</button>` : ''}
          </div>
          <div class="summary-grid">
            <div class="summary-card"><span>负责人</span><strong>${escapeHtml(userName(milestone.owner))}</strong></div>
            <div class="summary-card"><span>状态</span><strong>${statusLabels[milestone.status]}</strong></div>
            <div class="summary-card"><span>日期</span><strong>${dateText(milestone.date)}</strong></div>
            <div class="summary-card"><span>交付物</span><strong>${escapeHtml(milestone.deliverable || '-')}</strong></div>
          </div>
        </div>
      </section>
    </section>
  `;
}

function renderTimeline(sprint, nodes) {
  const sorted = [...nodes].sort((a, b) => a.date.localeCompare(b.date));
  if (!sorted.length) return '<div class="timeline-empty">暂无时间节点</div>';

  return `
    <div class="timeline">
      <div class="timeline-line"></div>
      <div class="timeline-track">
        ${sorted.map((node) => `
          <div class="timeline-node ${node.status}">
            <div class="timeline-dot"></div>
            <div class="timeline-card">
              <strong>${escapeHtml(node.title)}</strong>
              <span>${dateText(node.date)} · ${escapeHtml(node.owner || '-')}</span>
              <span>${node.isCritical ? '关键节点' : '普通节点'} · ${statusLabels[node.status]}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderRequirement(req) {
  const wetaskUrl = requirementWetaskUrl(req);
  return `
    <div class="mini-item" data-action="open-requirement" data-id="${req.id}" tabindex="0">
      <div class="mini-item-head">
        <div>
          <strong>${escapeHtml(req.code)} · ${escapeHtml(req.title)}</strong>
          <p class="small">${escapeHtml(req.description || '暂无描述')}</p>
        </div>
        <div class="requirement-actions">
          <span class="badge ${req.priority === 'P0' ? 'danger' : req.priority === 'P1' ? 'warning' : 'neutral'}">${req.priority}</span>
          ${wetaskUrl ? `<a class="external-link wetask-pill" href="${escapeHtml(wetaskUrl)}" target="_blank" rel="noreferrer" onclick="event.stopPropagation()">WeTask</a>` : '<span class="small">未绑定 WeTask</span>'}
        </div>
      </div>
      <div class="mini-item-foot">
        <p class="small">Owner ${escapeHtml(userName(req.owner || '-'))} · ${statusLabels[req.status]} · 交付 ${dateText(req.expectedDeliveryDate)}</p>
      </div>
    </div>
  `;
}

function renderMilestone(item) {
  return `
    <div class="mini-item milestone-item" data-action="open-milestone" data-id="${item.id}" tabindex="0">
      <div class="mini-item-head">
        <strong>${escapeHtml(item.name)}</strong>
        ${badge(item.status)}
      </div>
      <p class="small">${dateText(item.date)} · Owner ${escapeHtml(userName(item.owner || '-'))}</p>
      <p class="small">交付物：${escapeHtml(item.deliverable || '暂未填写')}</p>
    </div>
  `;
}

function renderNoSprint() {
  return '<section class="panel card"><div class="empty-state">当前项目暂无 Sprint。</div></section>';
}

function renderEmptyWorkspace() {
  return '<main class="panel card"><div class="empty-state">暂无项目，请先新建项目。</div></main>';
}

function renderDrawer() {
  if (!state.drawer) return '<aside class="drawer"></aside>';
  const { type, mode, draft } = state.drawer;
  const title = `${mode === 'create' ? '新建' : '编辑'}${type === 'project' ? '项目' : type === 'user' ? '用户' : 'Sprint'}`;
  return `
    <aside class="drawer open">
      <div class="drawer-inner">
        <div class="drawer-header">
          <div>
            <p class="eyebrow">PMO 原型表单</p>
            <h2>${title}</h2>
          </div>
          <button class="icon-button" data-action="close-drawer" aria-label="关闭">×</button>
        </div>
        ${type === 'project' ? renderProjectForm(draft) : type === 'user' ? renderUserForm(draft) : renderSprintForm(draft)}
      </div>
    </aside>
  `;
}

function renderProjectForm(project) {
  const canAssignProjectPm = isPmo();
  return `
    <form data-form="project">
      <div class="form-grid">
        ${field('项目名称', 'name', project.name, 'text', true)}
        ${canAssignProjectPm ? selectField('项目 PM', 'owner', pmOptions(project.owner)) : `${hiddenField('owner', project.owner)}<div class="field"><label>项目 PM</label><div class="readonly-field">${escapeHtml(userName(project.owner))}</div></div>`}
        ${canAssignProjectPm ? selectField('项目状态', 'status', projectStatusOptions(project.status)) : hiddenField('status', project.status)}
        ${field('开始日期', 'startDate', project.startDate, 'date', true)}
        ${field('结束日期', 'endDate', project.endDate, 'date', true)}
        ${hiddenField('goal', project.goal || project.description || '项目交付目标')}
        ${textareaField('项目描述', 'description', project.description)}
      </div>
      ${renderRepeatSection('members', '项目成员', project.members || [], renderMemberForm)}
      ${formFooter()}
    </form>
  `;
}

function renderUserForm(user) {
  const role = isPmo() ? normalizeRole(user.role) : 'member';
  const isCreate = state.drawer?.mode === 'create';
  return `
    <form data-form="user">
      <div class="form-grid">
        ${field('姓名', 'name', user.name || '', 'text', true)}
        ${field('用户账号', 'account', user.account || defaultAccount(user.name), 'text', true)}
        ${hiddenField('email', user.email || '')}
        ${field(isCreate ? '登录密码' : '新密码', 'password', '', 'password', isCreate)}
        ${field(isCreate ? '确认密码' : '确认新密码', 'confirmPassword', '', 'password', isCreate)}
        ${isPmo() ? selectField('角色', 'role', roleOptions(role)) : `${hiddenField('role', 'member')}<div class="field"><label>角色</label><div class="readonly-field">成员</div></div>`}
        ${hiddenField('status', user.status || 'active')}
      </div>
      ${formFooter()}
    </form>
  `;
}

function renderSprintForm(sprint) {
  return `
    <form data-form="sprint">
      <div class="form-grid">
        ${field('Sprint 名称', 'name', sprint.name, 'text', true)}
        ${selectField('Sprint Owner', 'owner', projectMemberOptions(sprint.projectId, sprint.owner))}
        ${selectField('Sprint 状态', 'status', sprintStatusOptions(sprint.status))}
        ${selectField('优先级', 'priority', priorityOptions(sprint.priority))}
        ${field('开始日期', 'startDate', sprint.startDate, 'date', true)}
        ${field('结束日期', 'endDate', sprint.endDate, 'date', true)}
        ${selectField('参与团队', 'teams', teamOptions(sprint.teams), true)}
        ${textareaField('Sprint 目标', 'goal', sprint.goal, true)}
        ${textareaField('业务目标', 'businessGoal', sprint.businessGoal)}
        ${textareaField('交付目标', 'deliveryGoal', sprint.deliveryGoal)}
        ${textareaField('质量目标', 'qualityGoal', sprint.qualityGoal)}
        ${textareaField('验收标准', 'acceptanceCriteria', sprint.acceptanceCriteria)}
        ${textareaField('风险说明', 'riskNote', sprint.riskNote)}
      </div>
      ${renderRepeatSection('requirements', '关键需求', sprint.requirements, renderRequirementForm)}
      ${renderRepeatSection('milestones', '里程碑', sprint.milestones, renderMilestoneForm)}
      ${renderRepeatSection('timelineNodes', '时间轴节点', sprint.timelineNodes, renderTimelineNodeForm)}
      ${formFooter()}
    </form>
  `;
}

function formatFieldLabel(label, required = false) {
  return `${label}${required ? '<span class="required-mark">*</span>' : ''}`;
}

function field(label, name, value = '', type = 'text', required = false) {
  return `<div class="field"><label>${formatFieldLabel(label, required)}</label><input name="${name}" type="${type}" value="${escapeHtml(value)}" ${required ? 'required' : ''} /></div>`;
}

function hiddenField(name, value = '') {
  return `<input name="${name}" type="hidden" value="${escapeHtml(value)}" />`;
}

function textareaField(label, name, value = '', required = false) {
  return `<div class="field full"><label>${formatFieldLabel(label, required)}</label><textarea name="${name}" ${required ? 'required' : ''}>${escapeHtml(value || '')}</textarea></div>`;
}

function selectField(label, name, options, multiple = false, required = false) {
  return `<div class="field ${multiple ? 'full' : ''}"><label>${formatFieldLabel(label, required)}</label><select name="${name}" ${multiple ? 'multiple size="4"' : ''} ${required ? 'required' : ''}>${options}</select></div>`;
}

function projectStatusOptions(selected) {
  return ['planning', 'active', 'completed', 'paused'].map((status) => `<option value="${status}" ${selected === status ? 'selected' : ''}>${statusLabels[status]}</option>`).join('');
}

function roleOptions(selected) {
  return ['pmo', 'pm', 'member'].map((role) => `<option value="${role}" ${normalizeRole(selected) === role ? 'selected' : ''}>${roleLabels[role]}</option>`).join('');
}

function userStatusOptions(selected) {
  return ['active', 'paused'].map((status) => `<option value="${status}" ${selected === status ? 'selected' : ''}>${status === 'active' ? '启用' : '停用'}</option>`).join('');
}

function sprintStatusOptions(selected) {
  return ['not_started', 'active', 'completed', 'paused', 'delayed'].map((status) => `<option value="${status}" ${selected === status ? 'selected' : ''}>${statusLabels[status]}</option>`).join('');
}

function priorityOptions(selected = 'medium') {
  return ['high', 'medium', 'low'].map((priority) => `<option value="${priority}" ${selected === priority ? 'selected' : ''}>${priority}</option>`).join('');
}

function renderRepeatSection(key, title, items, renderer) {
  return `
    <section class="form-section">
      <div class="form-section-title">
        <h3>${title}</h3>
        <button type="button" class="button" data-action="add-repeat" data-key="${key}">+ 添加</button>
      </div>
      <div class="repeat-list">
        ${items.length ? items.map((item, index) => renderer(item, index)).join('') : `<div class="timeline-empty">暂无${title}</div>`}
      </div>
    </section>
  `;
}

function renderMemberForm(member, index) {
  const value = typeof member === 'string' ? member : member.name;
  return `
    <div class="repeat-card compact-repeat">
      <div class="form-grid">
        ${selectField('项目成员', `members.${index}.name`, manageableMemberOptions(value))}
        <div class="field repeat-remove-field">
          <label>&nbsp;</label>
          <button type="button" class="button danger" data-action="remove-repeat" data-key="members" data-index="${index}">删除成员</button>
        </div>
      </div>
    </div>
  `;
}

function renderRequirementForm(item, index) {
  const sprintProjectId = state.drawer?.draft?.projectId || state.edit?.draft?.projectId || state.selectedProjectId;
  return `
    <div class="repeat-card">
      <div class="repeat-card-head">
        <strong>需求 ${index + 1}</strong>
        <button type="button" class="link-button danger" data-action="remove-repeat" data-key="requirements" data-index="${index}">删除</button>
      </div>
      <div class="form-grid">
        ${field('需求编号', `requirements.${index}.code`, item.code, 'text', true)}
        ${field('需求标题', `requirements.${index}.title`, item.title, 'text', true)}
        ${selectField('优先级', `requirements.${index}.priority`, ['P0', 'P1', 'P2', 'P3'].map((p) => `<option value="${p}" ${item.priority === p ? 'selected' : ''}>${p}</option>`).join(''), false, true)}
        ${selectField('负责人', `requirements.${index}.owner`, projectMemberOptions(sprintProjectId, item.owner), false, true)}
        ${selectField('状态', `requirements.${index}.status`, requirementStatusOptions(item.status), false, true)}
        ${field('预期交付时间', `requirements.${index}.expectedDeliveryDate`, item.expectedDeliveryDate, 'date')}
        ${field('WeTask 链接', `requirements.${index}.wetaskUrl`, item.wetaskUrl || '', 'url')}
        ${textareaField('需求描述', `requirements.${index}.description`, item.description)}
        ${textareaField('验收标准', `requirements.${index}.acceptanceCriteria`, item.acceptanceCriteria)}
      </div>
    </div>
  `;
}

function requirementStatusOptions(selected) {
  return ['draft', 'confirmed', 'in_development', 'in_testing', 'completed'].map((status) => `<option value="${status}" ${selected === status ? 'selected' : ''}>${statusLabels[status]}</option>`).join('');
}

function renderMilestoneForm(item, index) {
  const sprintProjectId = state.drawer?.draft?.projectId || state.edit?.draft?.projectId || state.selectedProjectId;
  return `
    <div class="repeat-card">
      <div class="repeat-card-head">
        <strong>里程碑 ${index + 1}</strong>
        <button type="button" class="link-button danger" data-action="remove-repeat" data-key="milestones" data-index="${index}">删除</button>
      </div>
      <div class="form-grid">
        ${field('里程碑名称', `milestones.${index}.name`, item.name, 'text', true)}
        ${field('里程碑日期', `milestones.${index}.date`, item.date, 'date', true)}
        ${selectField('负责人', `milestones.${index}.owner`, projectMemberOptions(sprintProjectId, item.owner), false, true)}
        ${selectField('状态', `milestones.${index}.status`, sprintStatusOptions(item.status), false, true)}
        ${field('交付物', `milestones.${index}.deliverable`, item.deliverable)}
        ${textareaField('描述', `milestones.${index}.description`, item.description)}
      </div>
    </div>
  `;
}

function renderTimelineNodeForm(item, index) {
  const sprintProjectId = state.drawer?.draft?.projectId || state.edit?.draft?.projectId || state.selectedProjectId;
  return `
    <div class="repeat-card">
      <div class="repeat-card-head">
        <strong>节点 ${index + 1}</strong>
        <button type="button" class="link-button danger" data-action="remove-repeat" data-key="timelineNodes" data-index="${index}">删除</button>
      </div>
      <div class="form-grid">
        ${field('节点名称', `timelineNodes.${index}.title`, item.title, 'text', true)}
        ${field('节点日期', `timelineNodes.${index}.date`, item.date, 'date', true)}
        ${selectField('节点类型', `timelineNodes.${index}.type`, timelineTypeOptions(item.type), false, true)}
        ${selectField('负责人', `timelineNodes.${index}.owner`, projectMemberOptions(sprintProjectId, item.owner), false, true)}
        ${selectField('状态', `timelineNodes.${index}.status`, sprintStatusOptions(item.status), false, true)}
        ${selectField('是否关键节点', `timelineNodes.${index}.isCritical`, `<option value="true" ${item.isCritical ? 'selected' : ''}>是</option><option value="false" ${!item.isCritical ? 'selected' : ''}>否</option>`, false, true)}
        ${textareaField('说明', `timelineNodes.${index}.description`, item.description)}
      </div>
    </div>
  `;
}

function timelineTypeOptions(selected = 'custom') {
  const labels = {
    requirement: '需求',
    design: '设计',
    development: '开发',
    testing: '测试',
    release: '发布',
    review: '复盘/评审',
    custom: '自定义',
  };
  return Object.entries(labels).map(([value, label]) => `<option value="${value}" ${selected === value ? 'selected' : ''}>${label}</option>`).join('');
}

function formFooter() {
  return `
    <div class="form-footer">
      <button type="button" class="button" data-action="close-drawer">取消</button>
      <button type="submit" class="button primary">保存</button>
    </div>
  `;
}

function openProjectDrawer(mode, project = null) {
  if (!requirePermission(mode === 'edit' ? canManageProject(project) : canCreateProject(), '只有 PMO 可以创建项目；项目 PM 只能编辑自己负责的项目')) return;
  const defaultOwner = systemUsers().find((user) => normalizeRole(user.role) === 'pm' && user.status === 'active')?.id || state.currentUserId;
  state.drawer = {
    type: 'project',
    mode,
    draft: structuredClone(project || {
      id: uid('p'),
      name: '',
      description: '',
      owner: defaultOwner,
      members: [defaultOwner],
      status: 'planning',
      startDate: today(),
      endDate: today(),
      goal: '',
      teams: ['产品', '研发'],
      createdAt: today(),
      updatedAt: today(),
    }),
  };
  render();
}

function openUserDrawer(mode, user = null) {
  if (!requirePermission(isPmo(), '只有 PMO 可以新增和编辑用户')) return;
  state.drawer = {
    type: 'user',
    mode,
    draft: structuredClone(user || {
      id: uid('u'),
      name: '',
      account: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'member',
      status: 'active',
    }),
  };
  render();
}

function openSprintDrawer(mode, sprint = null) {
  const project = sprint ? state.projects.find((item) => item.id === sprint.projectId) : currentProject();
  if (!requirePermission(canManageProject(project), '只有 PMO 或项目 PM 可以管理 Sprint')) return;
  const childData = sprint ? sprintChildren(sprint.id) : { milestones: [], requirements: [], timelineNodes: [] };
  const draft = structuredClone(sprint || {
    id: uid('s'),
    projectId: state.selectedProjectId,
    name: '',
    goal: '',
    description: '',
    owner: firstProjectMember(state.selectedProjectId),
    status: 'not_started',
    priority: 'medium',
    startDate: currentProject()?.startDate || today(),
    endDate: currentProject()?.endDate || today(),
    businessGoal: '',
    deliveryGoal: '',
    qualityGoal: '',
    acceptanceCriteria: '',
    teams: ['产品', '研发'],
    riskNote: '',
    createdAt: today(),
    updatedAt: today(),
  });
  draft.milestones = structuredClone(childData.milestones);
  draft.requirements = structuredClone(childData.requirements);
  draft.timelineNodes = structuredClone(childData.timelineNodes);
  state.drawer = { type: 'sprint', mode, draft };
  render();
}

function openSprintDrawerAndAppendRepeat(key) {
  const sprint = currentSprint();
  if (!sprint) return;
  openSprintDrawer('edit', sprint);
  addRepeat(key);
}

function openSprintEdit(mode = 'basic', sprint = currentSprint(), appendKey = '') {
  const project = state.projects.find((item) => item.id === sprint?.projectId) || currentProject();
  if (!requirePermission(canManageProject(project), '只有 PMO 或项目 PM 可以编辑 Sprint')) return;
  if (!sprint) return;
  state.selectedProjectId = sprint.projectId;
  state.selectedSprintId = sprint.id;
  state.drawer = null;
  state.edit = { type: 'sprint-edit', step: mode, draft: sprintEditDraft(sprint) };
  state.view = 'sprintEdit';
  if (appendKey) {
    addRepeat(appendKey);
    return;
  }
  render();
}

function openSprintCreate(projectId = state.selectedProjectId) {
  const project = state.projects.find((item) => item.id === projectId) || currentProject();
  if (!requirePermission(canManageProject(project), '只有 PMO 或项目 PM 可以创建 Sprint')) return;
  state.selectedProjectId = project.id;
  state.drawer = null;
  state.edit = { type: 'sprint-create', step: 'basic', draft: createSprintDraft(project.id) };
  state.view = 'sprintCreate';
  render();
}

function setSprintCreateStep(step) {
  if (!state.edit || state.edit.type !== 'sprint-create') return;
  const order = ['basic', 'plan', 'requirements'];
  const currentIndex = order.indexOf(state.edit.step || 'basic');
  const nextIndex = order.indexOf(step);
  if (nextIndex > currentIndex) {
    const error = validateSprintCreateStep(state.edit.draft, state.edit.step || 'basic');
    if (error) {
      showToast(error);
      return;
    }
  }
  state.edit.step = step;
  render();
}

function sprintCreateStepOffset(offset) {
  if (!state.edit || state.edit.type !== 'sprint-create') return;
  const order = ['basic', 'plan', 'requirements'];
  const index = order.indexOf(state.edit.step || 'basic');
  if (offset > 0) {
    const error = validateSprintCreateStep(state.edit.draft, state.edit.step || 'basic');
    if (error) {
      showToast(error);
      return;
    }
  }
  state.edit.step = order[Math.max(0, Math.min(order.length - 1, index + offset))];
  render();
}

function setSprintEditStep(step) {
  if (!state.edit || state.edit.type !== 'sprint-edit') return;
  const order = ['basic', 'plan', 'requirements'];
  const currentIndex = order.indexOf(state.edit.step || 'basic');
  const nextIndex = order.indexOf(step);
  if (nextIndex > currentIndex) {
    const error = validateSprintCreateStep(state.edit.draft, state.edit.step || 'basic');
    if (error) {
      showToast(error);
      return;
    }
  }
  state.edit.step = step;
  render();
}

function sprintEditStepOffset(offset) {
  if (!state.edit || state.edit.type !== 'sprint-edit') return;
  const order = ['basic', 'plan', 'requirements'];
  const index = order.indexOf(state.edit.step || 'basic');
  if (offset > 0) {
    const error = validateSprintCreateStep(state.edit.draft, state.edit.step || 'basic');
    if (error) {
      showToast(error);
      return;
    }
  }
  state.edit.step = order[Math.max(0, Math.min(order.length - 1, index + offset))];
  render();
}

function showToast(message) {
  state.toast = message;
  render();
  window.setTimeout(() => {
    state.toast = '';
    render();
  }, 2200);
}

function readForm(form) {
  const formData = new FormData(form);
  const data = structuredClone(state.drawer?.draft || state.edit?.draft || {});

  for (const [key, value] of formData.entries()) {
    if (!key.includes('.')) {
      data[key] = value;
      continue;
    }
    const [collection, rawIndex, fieldName] = key.split('.');
    const itemIndex = Number(rawIndex);
    if (!data[collection]) data[collection] = [];
    if (typeof data[collection][itemIndex] !== 'object' || data[collection][itemIndex] === null) {
      data[collection][itemIndex] = {};
    }
    data[collection][itemIndex][fieldName] = value;
  }

  const teamsSelect = form?.querySelector?.('select[name="teams"]');
  if (teamsSelect) {
    data.teams = Array.from(teamsSelect.selectedOptions).map((option) => option.value);
  }

  if (data.timelineNodes) {
    data.timelineNodes = data.timelineNodes.map((node) => ({
      ...node,
      isCritical: node.isCritical === true || node.isCritical === 'true',
    }));
  }

  if (data.members) {
    data.members = [...new Set(data.members
      .map((member) => (typeof member === 'string' ? member : member.name))
      .filter((member) => member && member.trim())
      .map((member) => member.trim()))];
  }

  return data;
}

function validateProject(project) {
  if (!project.name.trim()) return '项目名称不能为空';
  project.goal = String(project.goal || project.description || project.name).trim();
  if (!project.members?.length) return '项目至少需要 1 个成员';
  if (!userRecord(project.owner) || !['pmo', 'pm'].includes(userRole(project.owner))) return '项目 PM 必须是 PMO 或 PM 角色';
  const invalidMember = project.members.find((id) => !userRecord(id) || userRecord(id).status !== 'active');
  if (invalidMember) return '项目成员必须来自已启用的成员管理用户';
  if (project.endDate < project.startDate) return '项目结束日期不能早于开始日期';
  return '';
}

function validateSprint(sprint) {
  const project = currentProject();
  if (!sprint.name.trim()) return 'Sprint 名称不能为空';
  if (!sprint.goal.trim()) return 'Sprint 目标不能为空';
  if (sprint.endDate < sprint.startDate) return 'Sprint 结束日期不能早于开始日期';
  if (project && (sprint.startDate < project.startDate || sprint.endDate > project.endDate)) {
    return 'Sprint 周期必须在项目周期内';
  }

  const duplicate = state.sprints.find((item) => item.projectId === sprint.projectId && item.id !== sprint.id && item.name === sprint.name);
  if (duplicate) return '当前项目下 Sprint 名称不能重复';

  const outsideMilestone = sprint.milestones.find((item) => item.date && (item.date < sprint.startDate || item.date > sprint.endDate));
  if (outsideMilestone) return `里程碑「${outsideMilestone.name || '未命名'}」不在 Sprint 周期内`;

  const outsideTimeline = sprint.timelineNodes.find((item) => item.date && (item.date < sprint.startDate || item.date > sprint.endDate));
  if (outsideTimeline) return `时间节点「${outsideTimeline.title || '未命名'}」不在 Sprint 周期内`;

  return '';
}

function validateSprintCreateStep(sprint, step) {
  if (!sprint) return 'Sprint 数据不存在';

  if (step === 'basic') {
    if (!String(sprint.name || '').trim()) return '请填写 Sprint 名称';
    if (!String(sprint.goal || '').trim()) return '请填写 Sprint 目标';
    if (!String(sprint.owner || '').trim()) return '请选择 Sprint Owner';
    if (!String(sprint.status || '').trim()) return '请选择 Sprint 状态';
    if (!String(sprint.priority || '').trim()) return '请选择优先级';
    if (!String(sprint.startDate || '').trim()) return '请选择开始日期';
    if (!String(sprint.endDate || '').trim()) return '请选择结束日期';
    if (sprint.endDate < sprint.startDate) return 'Sprint 结束日期不能早于开始日期';
    const project = state.projects.find((item) => item.id === sprint.projectId) || currentProject();
    if (project && (sprint.startDate < project.startDate || sprint.endDate > project.endDate)) {
      return 'Sprint 周期必须在项目周期内';
    }
    return '';
  }

  if (step === 'plan') {
    const invalidMilestone = (sprint.milestones || []).find((item) => {
      const filled = [item.name, item.date, item.owner, item.status, item.deliverable, item.description].some((value) => String(value || '').trim());
      if (!filled) return false;
      return !String(item.name || '').trim() || !String(item.date || '').trim() || !String(item.owner || '').trim() || !String(item.status || '').trim();
    });
    if (invalidMilestone) return '请补全里程碑的名称、日期、负责人和状态';

    const invalidTimeline = (sprint.timelineNodes || []).find((item) => {
      const filled = [item.title, item.date, item.type, item.owner, item.status, item.description, item.isCritical].some((value) => String(value ?? '').trim());
      if (!filled) return false;
      return !String(item.title || '').trim() || !String(item.date || '').trim() || !String(item.type || '').trim() || !String(item.owner || '').trim() || !String(item.status || '').trim();
    });
    if (invalidTimeline) return '请补全时间节点的名称、日期、类型、负责人和状态';
    return '';
  }

  if (step === 'requirements') {
    const invalidRequirement = (sprint.requirements || []).find((item) => {
      const filled = [item.code, item.title, item.priority, item.owner, item.status, item.expectedDeliveryDate, item.description, item.acceptanceCriteria, item.wetaskUrl].some((value) => String(value || '').trim());
      if (!filled) return false;
      return !String(item.code || '').trim() || !String(item.title || '').trim() || !String(item.priority || '').trim() || !String(item.owner || '').trim() || !String(item.status || '').trim();
    });
    if (invalidRequirement) return '请补全需求编号、标题、优先级、负责人和状态';
  }

  return '';
}

function validateUser(user) {
  user.account = String(user.account || defaultAccount(user.name)).trim().toLowerCase();
  user.name = String(user.name || '').trim();
  if (!user.name) return '用户姓名不能为空';
  if (!user.account) return '用户账号不能为空';
  if (!user.password?.trim() && !user.hasPassword) return '登录密码不能为空';
  if (user.password && user.password !== user.confirmPassword) return '两次输入的密码不一致';
  if (!isPmo() && normalizeRole(user.role) !== 'member') return 'PM 只能创建或编辑成员账号';
  const duplicateAccount = systemUsers().find((item) => item.id !== user.id && item.account === user.account);
  if (duplicateAccount) return '用户账号不能重复';
  return '';
}

function saveProject(form) {
  const project = readForm(form);
  const existing = state.projects.find((item) => item.id === project.id);
  if (!requirePermission(existing ? canManageProject(existing) : canCreateProject(), '当前账号无权保存该项目')) return;
  if (!isPmo() && existing) {
    project.owner = existing.owner;
    project.status = existing.status;
    project.teams = existing.teams;
  }
  const error = validateProject(project);
  if (error) {
    showToast(error);
    return;
  }
  project.updatedAt = today();
  if (!project.members.includes(project.owner)) project.members.unshift(project.owner);
  const index = state.projects.findIndex((item) => item.id === project.id);
  if (index >= 0) state.projects[index] = project;
  else state.projects.unshift(project);
  state.selectedProjectId = project.id;
  state.drawer = null;
  persistState();
  showToast('项目已保存');
}

function saveSprint(form) {
  const sprint = readForm(form);
  const project = state.projects.find((item) => item.id === sprint.projectId) || currentProject();
  if (!requirePermission(canManageProject(project), '只有 PMO 或项目 PM 可以保存 Sprint')) return;
  const error = validateSprint(sprint);
  if (error) {
    showToast(error);
    return;
  }

  const requirements = sprint.requirements.map((item) => ({ ...item, id: item.id || uid('r'), sprintId: sprint.id }));
  const milestones = sprint.milestones.map((item) => ({ ...item, id: item.id || uid('m'), sprintId: sprint.id }));
  const timelineNodes = sprint.timelineNodes.map((item) => ({ ...item, id: item.id || uid('t'), sprintId: sprint.id, requirementIds: item.requirementIds || [] }));
  delete sprint.requirements;
  delete sprint.milestones;
  delete sprint.timelineNodes;
  sprint.updatedAt = today();

  const index = state.sprints.findIndex((item) => item.id === sprint.id);
  if (index >= 0) state.sprints[index] = sprint;
  else state.sprints.unshift(sprint);

  state.requirements = state.requirements.filter((item) => item.sprintId !== sprint.id).concat(requirements);
  state.milestones = state.milestones.filter((item) => item.sprintId !== sprint.id).concat(milestones);
  state.timelineNodes = state.timelineNodes.filter((item) => item.sprintId !== sprint.id).concat(timelineNodes);
  state.selectedSprintId = sprint.id;
  state.drawer = null;
  persistState();
  showToast('Sprint 已保存');
}

function saveSprintCreate(form) {
  const sprint = readForm(form);
  const project = state.projects.find((item) => item.id === sprint.projectId) || currentProject();
  if (!requirePermission(canManageProject(project), '只有 PMO 或项目 PM 可以创建 Sprint')) return;
  for (const step of ['basic', 'plan', 'requirements']) {
    const stepError = validateSprintCreateStep(sprint, step);
    if (stepError) {
      state.edit.step = step;
      showToast(stepError);
      return;
    }
  }
  const error = validateSprint(sprint);
  if (error) {
    showToast(error);
    return;
  }

  const requirements = (sprint.requirements || []).map((item) => ({ ...item, id: item.id || uid('r'), sprintId: sprint.id }));
  const milestones = (sprint.milestones || []).map((item) => ({ ...item, id: item.id || uid('m'), sprintId: sprint.id }));
  const timelineNodes = (sprint.timelineNodes || []).map((item) => ({ ...item, id: item.id || uid('t'), sprintId: sprint.id, requirementIds: item.requirementIds || [] }));
  delete sprint.requirements;
  delete sprint.milestones;
  delete sprint.timelineNodes;
  sprint.updatedAt = today();
  state.sprints.unshift(sprint);
  state.requirements = state.requirements.concat(requirements);
  state.milestones = state.milestones.concat(milestones);
  state.timelineNodes = state.timelineNodes.concat(timelineNodes);
  state.selectedProjectId = sprint.projectId;
  state.selectedSprintId = sprint.id;
  state.edit = null;
  state.view = 'sprintDetail';
  persistState('sprint.created');
  showToast('Sprint 已创建');
}

function saveSprintEdit(form) {
  const draft = readForm(form);
  const existing = state.sprints.find((item) => item.id === draft.id);
  const project = state.projects.find((item) => item.id === existing?.projectId);
  if (!existing || !requirePermission(canManageProject(project), '只有 PMO 或项目 PM 可以保存 Sprint')) return;
  for (const step of ['basic', 'plan', 'requirements']) {
    const stepError = validateSprintCreateStep(draft, step);
    if (stepError) {
      state.edit.step = step;
      showToast(stepError);
      return;
    }
  }

  const nextSprint = {
    ...existing,
    name: draft.name,
    owner: draft.owner,
    status: draft.status,
    priority: draft.priority,
    startDate: draft.startDate,
    endDate: draft.endDate,
    description: draft.description,
    goal: draft.goal,
    acceptanceCriteria: draft.acceptanceCriteria,
    riskNote: draft.riskNote,
    milestones: draft.milestones || [],
    timelineNodes: draft.timelineNodes || [],
    requirements: draft.requirements || [],
  };
  const error = validateSprint(nextSprint);
  if (error) {
    showToast(error);
    return;
  }

  delete nextSprint.milestones;
  delete nextSprint.timelineNodes;
  delete nextSprint.requirements;
  nextSprint.updatedAt = today();
  state.sprints[state.sprints.findIndex((item) => item.id === existing.id)] = nextSprint;
  state.milestones = state.milestones
    .filter((item) => item.sprintId !== existing.id)
    .concat((draft.milestones || []).map((item) => ({ ...item, id: item.id || uid('m'), sprintId: existing.id })));
  state.timelineNodes = state.timelineNodes
    .filter((item) => item.sprintId !== existing.id)
    .concat((draft.timelineNodes || []).map((item) => ({ ...item, id: item.id || uid('t'), sprintId: existing.id, requirementIds: item.requirementIds || [] })));
  state.requirements = state.requirements
    .filter((item) => item.sprintId !== existing.id)
    .concat((draft.requirements || []).map((item) => ({ ...item, id: item.id || uid('r'), sprintId: existing.id })));

  state.edit = null;
  state.view = 'sprintDetail';
  persistState('sprint.edit.saved');
  showToast('Sprint 已保存');
}

function saveUser(form) {
  const user = readForm(form);
  const existing = state.users.find((item) => item.id === user.id);
  if (!requirePermission(isPmo(), '只有 PMO 可以保存用户')) return;
  if (!user.password && existing) {
    user.hasPassword = existing.hasPassword || Boolean(existing.password);
  }
  user.status = 'active';
  user.authManaged = true;
  const error = validateUser(user);
  if (error) {
    showToast(error);
    return;
  }
  delete user.confirmPassword;
  const index = state.users.findIndex((item) => item.id === user.id);
  if (index >= 0) state.users[index] = user;
  else state.users.unshift(user);
  state.drawer = null;
  persistState('user.saved');
  showToast('用户已保存');
}

async function login(form) {
  if (!form) return;
  const data = new FormData(form);
  const account = String(data.get('account') || '').trim().toLowerCase();
  const password = String(data.get('password') || '');
  if (!account || !password) {
    state.loginError = '请输入完整的用户账号和密码';
    render();
    return;
  }
  if (apiClient.usesRemote()) {
    try {
      const payload = await apiClient.login(account, password);
      applyBootState(payload.state, payload.backups || []);
      state.currentUserId = payload.user?.id || payload.state?.currentUserId || '';
      state.loginError = '';
      state.view = 'overview';
      render();
    } catch (error) {
      state.loginError = error.message || '用户账号或密码不正确，或账号未启用';
      render();
    }
    return;
  }
  const user = resolveLoginUser(account, password);
  if (!user || user.password !== password) {
    state.loginError = '用户账号或密码不正确，或账号未启用';
    render();
    return;
  }
  state.currentUserId = user.id;
  state.loginError = '';
  state.view = 'overview';
  persistState('auth.login');
  render();
}

async function setupSystem(form) {
  const data = new FormData(form);
  const account = String(data.get('account') || '').trim().toLowerCase();
  const name = String(data.get('name') || '').trim();
  const password = String(data.get('password') || '');
  if (!account || !name || !password) {
    state.loginError = '请输入完整的用户账号、姓名和密码';
    render();
    return;
  }
  try {
    const payload = await apiClient.setup({ account, name, password });
    applyBootState(payload.state, payload.backups || []);
    state.currentUserId = payload.user?.id || payload.state?.currentUserId || '';
    state.setupRequired = false;
    state.loginError = '';
    state.view = 'overview';
    render();
  } catch (error) {
    state.loginError = error.message || '初始化失败';
    render();
  }
}

function resolveLoginUser(account, password) {
  const exact = systemUsers().find((item) => item.account?.toLowerCase() === account && item.status === 'active');
  if (exact?.password === password) return exact;

  const seed = defaultState.users.find((item) => item.account === account && item.password === password && item.status === 'active');
  if (!seed) return exact;

  const exists = state.users.some((item) => item.account === seed.account);
  if (!exists) {
    const existingIds = new Set(state.users.map((item) => item.id));
    state.users.unshift({ ...structuredClone(seed), id: existingIds.has(seed.id) ? `${seed.id}-seed` : seed.id });
  }
  state.authSeedVersion = authSeedVersion;
  return state.users.find((item) => item.account === seed.account && item.status === 'active');
}

function logout() {
  apiClient.logout();
  state.currentUserId = '';
  state.loginError = '';
  state.drawer = null;
  persistState('auth.logout');
  render();
}

function submitLogin(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  const form = event?.target?.closest?.('form') || app.querySelector('form[data-form="login"]');
  login(form);
}

window.pmoLogin = submitLogin;

function addRepeat(key) {
  const draft = state.drawer?.draft || state.edit?.draft;
  if (!draft) return;

  const factories = {
    members: () => ({
      name: systemUsers().find((user) => user.status === 'active' && normalizeRole(user.role) === 'member')?.id || '',
    }),
    requirements: () => ({
      id: uid('r'),
      code: `REQ-${String((draft.requirements?.length || 0) + 1).padStart(3, '0')}`,
      title: '',
      description: '',
      priority: 'P1',
      owner: firstProjectMember(draft.projectId),
      status: 'draft',
      milestoneId: '',
      wetaskUrl: '',
      expectedDeliveryDate: draft.endDate,
      acceptanceCriteria: '',
    }),
    milestones: () => ({
      id: uid('m'),
      name: '',
      date: draft.endDate,
      owner: firstProjectMember(draft.projectId),
      status: 'not_started',
      description: '',
      deliverable: '',
    }),
    timelineNodes: () => ({
      id: uid('t'),
      title: '',
      type: 'custom',
      date: draft.endDate,
      owner: firstProjectMember(draft.projectId),
      description: '',
      isCritical: true,
      status: 'not_started',
      requirementIds: [],
    }),
  };

  draft[key].push(factories[key]());
  render();
}

function removeRepeat(key, index) {
  const draft = state.drawer?.draft || state.edit?.draft;
  if (!draft) return;
  draft[key].splice(index, 1);
  render();
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const { action, id, key, index, view, section, add, step } = target.dataset;

  if (action === 'select-project') {
    state.selectedProjectId = id;
    state.selectedSprintId = projectSprints(id)[0]?.id || '';
    state.view = 'overview';
    render();
  }
  if (action === 'open-sprint') {
    const sprint = state.sprints.find((item) => item.id === id);
    if (sprint) state.selectedProjectId = sprint.projectId;
    state.selectedSprintId = id;
    state.view = 'sprintDetail';
    render();
  }
  if (action === 'back-overview') {
    state.view = 'overview';
    state.edit = null;
    render();
  }
  if (action === 'cancel-sprint-create') {
    state.edit = null;
    state.view = 'overview';
    render();
  }
  if (action === 'back-sprint') {
    state.selectedSprintId = id;
    state.view = 'sprintDetail';
    state.edit = null;
    render();
  }
  if (action === 'cancel-sprint-edit') {
    state.edit = null;
    state.view = 'sprintDetail';
    render();
  }
  if (action === 'open-requirement') {
    state.selectedRequirementId = id;
    state.view = 'requirementDetail';
    render();
  }
  if (action === 'open-milestone') {
    state.selectedMilestoneId = id;
    state.view = 'milestoneDetail';
    render();
  }
  if (action === 'open-users') {
    if (!requirePermission(canManageUsers(), '成员无权访问成员管理')) return;
    state.edit = null;
    state.view = 'users';
    render();
  }
  if (action === 'open-data-backup') {
    if (!requirePermission(isPmo(), '只有 PMO 可以访问数据备份')) return;
    state.edit = null;
    state.view = 'dataBackup';
    render();
  }
  if (action === 'open-overview') {
    state.edit = null;
    state.view = 'overview';
    render();
  }
  if (action === 'login-submit') {
    submitLogin(event);
  }
  if (action === 'open-info-page') {
    state.edit = null;
    state.view = view;
    render();
  }
  if (action === 'new-project') openProjectDrawer('create');
  if (action === 'logout') logout();
  if (action === 'export-csv') exportBundle('csv');
  if (action === 'export-xls') exportBundle('xls');
  if (action === 'import-data') document.querySelector('#import-file')?.click();
  if (action === 'create-backup') createDataBackup();
  if (action === 'restore-backup') restoreDataBackup(id);
  if (action === 'export-backup') exportDataBackup(id);
  if (action === 'import-backup') document.querySelector('#backup-file')?.click();
  if (action === 'new-user') openUserDrawer('create');
  if (action === 'edit-user') openUserDrawer('edit', state.users.find((user) => user.id === id));
  if (action === 'edit-project') openProjectDrawer('edit', state.projects.find((project) => project.id === id));
  if (action === 'new-sprint') {
    if (id) {
      state.selectedProjectId = id;
      state.selectedSprintId = projectSprints(id)[0]?.id || '';
    }
    openSprintCreate(id || state.selectedProjectId);
  }
  if (action === 'sprint-create-step') {
    state.edit.draft = readForm(target.closest('form'));
    setSprintCreateStep(step);
  }
  if (action === 'sprint-create-next') {
    state.edit.draft = readForm(target.closest('form'));
    sprintCreateStepOffset(1);
  }
  if (action === 'sprint-create-prev') {
    state.edit.draft = readForm(target.closest('form'));
    sprintCreateStepOffset(-1);
  }
  if (action === 'sprint-edit-step') {
    state.edit.draft = readForm(target.closest('form'));
    setSprintEditStep(step);
  }
  if (action === 'sprint-edit-next') {
    state.edit.draft = readForm(target.closest('form'));
    sprintEditStepOffset(1);
  }
  if (action === 'sprint-edit-prev') {
    state.edit.draft = readForm(target.closest('form'));
    sprintEditStepOffset(-1);
  }
  if (action === 'edit-sprint') openSprintEdit(step || 'basic', state.sprints.find((sprint) => sprint.id === id), add);
  if (action === 'edit-sprint-section') openSprintEdit(section, state.sprints.find((sprint) => sprint.id === id), add);
  if (action === 'add-milestone') openSprintEdit('plan', currentSprint(), 'milestones');
  if (action === 'add-timeline-node') openSprintEdit('plan', currentSprint(), 'timelineNodes');
  if (action === 'close-drawer') {
    state.drawer = null;
    render();
  }
  if (action === 'add-repeat') {
    if (state.drawer) state.drawer.draft = readForm(target.closest('form'));
    if (state.edit) state.edit.draft = readForm(target.closest('form'));
    addRepeat(key);
  }
  if (action === 'remove-repeat') {
    if (state.drawer) state.drawer.draft = readForm(target.closest('form'));
    if (state.edit) state.edit.draft = readForm(target.closest('form'));
    removeRepeat(key, Number(index));
  }
  if (action === 'delete-project') deleteProject(id);
  if (action === 'delete-sprint') deleteSprint(id);
  if (action === 'delete-user') deleteUser(id);
});

app.addEventListener('input', (event) => {
  if (event.target.dataset.action === 'search') {
    const cursor = event.target.selectionStart;
    state.search = event.target.value;
    render();
    const input = app.querySelector('[data-action="search"]');
    if (input) {
      input.focus();
      input.setSelectionRange(cursor, cursor);
    }
  }
});

app.addEventListener('change', async (event) => {
  if (event.target.dataset.action === 'project-filter') {
    state.projectStatus = event.target.value;
    render();
  }
  if (event.target.dataset.action === 'sprint-filter') {
    state.sprintStatus = event.target.value;
    render();
  }
  if (event.target.id === 'import-file') {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await importBundle(file);
      showToast('导入完成');
    } catch (error) {
      showToast(`导入失败：${error.message}`);
    } finally {
      event.target.value = '';
    }
  }
  if (event.target.id === 'backup-file') {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await importBackupFile(file);
    } catch (error) {
      showToast(`备份导入失败：${error.message}`);
    } finally {
      event.target.value = '';
    }
  }
});

app.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.dataset.form === 'setup') setupSystem(form);
  if (form.dataset.form === 'login') login(form);
  if (form.dataset.form === 'project') saveProject(form);
  if (form.dataset.form === 'sprint') saveSprint(form);
  if (form.dataset.form === 'sprint-create') saveSprintCreate(form);
  if (form.dataset.form === 'sprint-edit' || form.dataset.form?.startsWith('sprint-edit-')) saveSprintEdit(form);
  if (form.dataset.form === 'user') saveUser(form);
});

function deleteProject(id) {
  const project = state.projects.find((item) => item.id === id);
  if (!requirePermission(isPmo(), '只有 PMO 可以删除项目')) return;
  if (!project || !window.confirm(`确认删除项目「${project.name}」？`)) return;
  const sprintIds = state.sprints.filter((sprint) => sprint.projectId === id).map((sprint) => sprint.id);
  state.projects = state.projects.filter((item) => item.id !== id);
  state.sprints = state.sprints.filter((item) => item.projectId !== id);
  state.requirements = state.requirements.filter((item) => !sprintIds.includes(item.sprintId));
  state.milestones = state.milestones.filter((item) => !sprintIds.includes(item.sprintId));
  state.timelineNodes = state.timelineNodes.filter((item) => !sprintIds.includes(item.sprintId));
  state.selectedProjectId = state.projects[0]?.id || '';
  state.selectedSprintId = projectSprints()[0]?.id || '';
  state.view = 'overview';
  persistState();
  showToast('项目已删除');
}

function deleteSprint(id) {
  const sprint = state.sprints.find((item) => item.id === id);
  const project = state.projects.find((item) => item.id === sprint?.projectId);
  if (!requirePermission(canManageProject(project), '只有 PMO 或项目 PM 可以删除 Sprint')) return;
  if (!sprint || !window.confirm(`确认删除 Sprint「${sprint.name}」？`)) return;
  state.sprints = state.sprints.filter((item) => item.id !== id);
  state.requirements = state.requirements.filter((item) => item.sprintId !== id);
  state.milestones = state.milestones.filter((item) => item.sprintId !== id);
  state.timelineNodes = state.timelineNodes.filter((item) => item.sprintId !== id);
  state.selectedSprintId = projectSprints()[0]?.id || '';
  state.view = 'overview';
  persistState();
  showToast('Sprint 已删除');
}

function deleteUser(id) {
  const user = state.users.find((item) => item.id === id);
  if (!requirePermission(isPmo(), '只有 PMO 可以删除用户')) return;
  if (user?.id === state.currentUserId) {
    showToast('不能删除当前登录账号');
    return;
  }
  if (!user || !window.confirm(`确认删除用户「${user.name}」？`)) return;
  const inUse = state.projects.some((project) => project.owner === id || project.members?.includes(id)) ||
    state.sprints.some((sprint) => sprint.owner === id) ||
    state.requirements.some((req) => req.owner === id) ||
    state.milestones.some((milestone) => milestone.owner === id) ||
    state.timelineNodes.some((node) => node.owner === id);
  if (inUse) {
    showToast('该用户仍被项目或事项引用，不能删除');
    return;
  }
  state.users = state.users.filter((item) => item.id !== id);
  persistState('user.deleted');
  showToast('用户已删除');
}

function applyBootState(savedState, backups = [], setupRequired = false) {
  const nextState = setupRequired ? { ...migrateBusinessState(null), setupRequired: true, currentUserId: '', users: [], projects: [], sprints: [], requirements: [], milestones: [], timelineNodes: [] } : migrateBusinessState(savedState);
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, nextState);
  remoteBaseState = setupRequired ? null : cloneSerializableState(nextState);
  backupCache = backups;
  normalizeState();
  applyRouteFromHash();
}

function startApp() {
  render();
  if (!apiClient.usesRemote()) return;
  apiClient.bootstrap().then(({ state: loadedState, backups, setupRequired }) => {
    applyBootState(loadedState, backups, setupRequired);
    isBooting = false;
    render();
  });
}

startApp();
