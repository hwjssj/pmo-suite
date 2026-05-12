import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createRepository, openDatabase } from '../server/database.js';
import { canSaveState, createInitialState, hashPassword, mergeBusinessState, sanitizeStateForClient, secureStateForStorage, validateBusinessState, verifyPassword } from '../server/index.js';

function createTestRepository() {
  const dbPath = join(mkdtempSync(join(tmpdir(), 'pmo-suite-')), 'test.sqlite');
  const repository = createRepository(openDatabase(dbPath));
  return { repository };
}

test('SQLite repository persists business state', () => {
  const { repository } = createTestRepository();
  try {
    const state = {
      currentUserId: 'u-1',
      users: [{ id: 'u-1', account: 'zhangsan', name: '张三', role: 'pmo', status: 'active' }],
      projects: [],
      sprints: [],
      requirements: [],
      milestones: [],
      timelineNodes: [],
      auditLogs: [{ id: 'audit-1', event: 'test.state.saved', at: '2026-05-12 10:00' }],
    };

    repository.saveState(state);
    const savedState = repository.getState();
    assert.equal(savedState.users[0].account, 'zhangsan');
    assert.equal(savedState.auditLogs[0].event, 'test.state.saved');
  } finally {
    repository.close();
  }
});

test('SQLite repository tracks migrations, revision, and auth sessions', () => {
  const { repository } = createTestRepository();
  try {
    const state = {
      currentUserId: '',
      users: [{ id: 'u-1', account: 'zhangsan', name: '张三', role: 'pmo', status: 'active' }],
      projects: [],
      sprints: [],
      requirements: [],
      milestones: [],
      timelineNodes: [],
      auditLogs: [],
    };

    repository.saveState(state);
    assert.equal(repository.getState().revision, 1);
    repository.saveState({ ...state, projects: [{ id: 'p-1', name: '项目', owner: 'u-1', members: ['u-1'] }] });
    assert.equal(repository.getState().revision, 2);
    assert.equal(repository.listMigrations().some((migration) => migration.id === '002_sessions_and_revision'), true);
    assert.equal(repository.listMigrations().some((migration) => migration.id === '003_relational_business_tables'), true);
    assert.equal(repository.tableCounts().users, 1);
    assert.equal(repository.tableCounts().projects, 1);

    repository.createSession('token-hash', 'u-1', '2999-01-01 00:00');
    assert.equal(repository.getSession('token-hash').user_id, 'u-1');
    repository.deleteSession('token-hash');
    assert.equal(repository.getSession('token-hash'), null);
  } finally {
    repository.close();
  }
});

test('setup helper creates initial PMO state without plain text credentials', () => {
  const state = createInitialState({ account: 'ADMIN', name: '管理员', password: 'safe-pass' });
  assert.equal(state.users.length, 1);
  assert.equal(state.users[0].account, 'admin');
  assert.equal(state.users[0].role, 'pmo');
  assert.equal(state.users[0].password, undefined);
  assert.equal(verifyPassword('safe-pass', state.users[0].passwordHash), true);
});

test('SQLite repository persists backup snapshots in latest-first order', () => {
  const { repository } = createTestRepository();
  try {
    const backups = [
      {
        id: 'backup-old',
        format: 'pmo-suite-backup',
        version: 1,
        createdAt: '2026-05-12 09:30',
        summary: { users: 1, projects: 0, sprints: 0, requirements: 0 },
        state: { users: [], projects: [], sprints: [] },
      },
      {
        id: 'backup-new',
        format: 'pmo-suite-backup',
        version: 1,
        createdAt: '2026-05-12 10:30',
        summary: { users: 2, projects: 1, sprints: 1, requirements: 0 },
        state: { users: [], projects: [], sprints: [] },
      },
    ];

    repository.replaceBackups(backups);
    const savedBackups = repository.listBackups();
    assert.equal(savedBackups.length, 2);
    assert.equal(savedBackups[0].id, 'backup-new');
    assert.equal(savedBackups[1].id, 'backup-old');
  } finally {
    repository.close();
  }
});

test('server credential helpers hash passwords and sanitize client state', () => {
  const hash = hashPassword('123456');
  assert.equal(hash.startsWith('scrypt$'), true);
  assert.equal(verifyPassword('123456', hash), true);
  assert.equal(verifyPassword('wrong', hash), false);

  const secured = secureStateForStorage({
    users: [{ id: 'u-1', account: 'ZHANGSAN', name: '张三', password: '123456', role: 'pmo', status: 'active' }],
    projects: [],
    sprints: [],
    requirements: [],
    milestones: [],
    timelineNodes: [],
    auditLogs: [],
  });
  assert.equal(secured.users[0].account, 'zhangsan');
  assert.equal(secured.users[0].password, undefined);
  assert.equal(secured.users[0].passwordHash.startsWith('scrypt$'), true);

  const clientState = sanitizeStateForClient(secured, 'u-1');
  assert.equal(clientState.currentUserId, 'u-1');
  assert.equal(clientState.users[0].passwordHash, undefined);
  assert.equal(clientState.users[0].hasPassword, true);
});

test('server validation and permission checks block unsafe snapshot writes', () => {
  const previousState = {
    users: [
      { id: 'u-pmo', account: 'zhangsan', name: '张三', role: 'pmo', status: 'active', passwordHash: 'hash' },
      { id: 'u-pm', account: 'lisi', name: '李四', role: 'pm', status: 'active', passwordHash: 'hash' },
      { id: 'u-member', account: 'wangwu', name: '王五', role: 'member', status: 'active', passwordHash: 'hash' },
    ],
    projects: [{ id: 'p-1', name: '项目一', owner: 'u-pm', members: ['u-pm'], status: 'active' }],
    sprints: [],
    requirements: [],
    milestones: [],
    timelineNodes: [],
    auditLogs: [],
  };

  assert.equal(validateBusinessState(previousState), '');
  assert.match(validateBusinessState({ ...previousState, users: [{ id: 'u-x' }] }), /用户必须包含/);

  const pmAllowedState = {
    ...previousState,
    projects: [{ ...previousState.projects[0], description: 'PM 修改自己负责项目' }],
  };
  assert.equal(canSaveState(previousState, pmAllowedState, previousState.users[1]).allowed, true);

  const pmUserChange = {
    ...previousState,
    users: previousState.users.concat({ id: 'u-new', account: 'newuser', name: '新用户', role: 'member', status: 'active' }),
  };
  assert.equal(canSaveState(previousState, pmUserChange, previousState.users[1]).allowed, false);

  const memberChange = {
    ...previousState,
    projects: [{ ...previousState.projects[0], description: '成员尝试修改' }],
  };
  assert.equal(canSaveState(previousState, memberChange, previousState.users[2]).allowed, false);
});

test('business state merge preserves independent concurrent changes', () => {
  const baseState = {
    users: [{ id: 'u-1', account: 'zhangsan', name: '张三', role: 'pmo', status: 'active' }],
    projects: [{ id: 'p-1', name: '项目一', owner: 'u-1', members: ['u-1'], status: 'active' }],
    sprints: [],
    requirements: [],
    milestones: [],
    timelineNodes: [],
    auditLogs: [{ id: 'audit-base', at: '2026-05-12 10:00', event: 'base' }],
  };
  const serverState = {
    ...baseState,
    revision: 2,
    projects: baseState.projects.concat({ id: 'p-2', name: '项目二', owner: 'u-1', members: ['u-1'], status: 'planning' }),
    auditLogs: baseState.auditLogs.concat({ id: 'audit-server', at: '2026-05-12 10:01', event: 'server' }),
  };
  const clientState = {
    ...baseState,
    revision: 1,
    sprints: [{ id: 's-1', projectId: 'p-1', name: 'Sprint 1', owner: 'u-1', status: 'active' }],
    auditLogs: baseState.auditLogs.concat({ id: 'audit-client', at: '2026-05-12 10:02', event: 'client' }),
  };

  const result = mergeBusinessState(baseState, serverState, clientState);

  assert.deepEqual(result.conflicts, []);
  assert.equal(result.state.projects.some((project) => project.id === 'p-2'), true);
  assert.equal(result.state.sprints.some((sprint) => sprint.id === 's-1'), true);
  assert.equal(result.state.auditLogs.some((log) => log.id === 'audit-server'), true);
  assert.equal(result.state.auditLogs.some((log) => log.id === 'audit-client'), true);
});

test('business state merge detects same-field concurrent conflicts without overwriting server data', () => {
  const baseState = {
    users: [{ id: 'u-1', account: 'zhangsan', name: '张三', role: 'pmo', status: 'active' }],
    projects: [{ id: 'p-1', name: '项目一', description: '初始说明', owner: 'u-1', members: ['u-1'], status: 'active' }],
    sprints: [],
    requirements: [],
    milestones: [],
    timelineNodes: [],
    auditLogs: [],
  };
  const serverState = {
    ...baseState,
    projects: [{ ...baseState.projects[0], description: '服务端说明' }],
  };
  const clientState = {
    ...baseState,
    projects: [{ ...baseState.projects[0], description: '客户端说明' }],
  };

  const result = mergeBusinessState(baseState, serverState, clientState);

  assert.equal(result.conflicts.length, 1);
  assert.equal(result.conflicts[0].collection, 'projects');
  assert.equal(result.conflicts[0].fields.includes('description'), true);
  assert.equal(result.state.projects[0].description, '服务端说明');
});

test('business state merge combines disjoint fields on the same entity', () => {
  const baseState = {
    users: [{ id: 'u-1', account: 'zhangsan', name: '张三', role: 'pmo', status: 'active' }],
    projects: [{ id: 'p-1', name: '项目一', description: '初始说明', owner: 'u-1', members: ['u-1'], status: 'planning' }],
    sprints: [],
    requirements: [],
    milestones: [],
    timelineNodes: [],
    auditLogs: [],
  };
  const serverState = {
    ...baseState,
    projects: [{ ...baseState.projects[0], status: 'active' }],
  };
  const clientState = {
    ...baseState,
    projects: [{ ...baseState.projects[0], description: '客户端补充说明' }],
  };

  const result = mergeBusinessState(baseState, serverState, clientState);

  assert.deepEqual(result.conflicts, []);
  assert.equal(result.state.projects[0].status, 'active');
  assert.equal(result.state.projects[0].description, '客户端补充说明');
});

test('backup checksum is attached through API-compatible enrichment path', () => {
  const { repository } = createTestRepository();
  try {
    const backup = {
      id: 'backup-checksum',
      format: 'pmo-suite-backup',
      version: 1,
      createdAt: '2026-05-12 12:00',
      state: {
        users: [{ id: 'u-1', account: 'zhangsan', name: '张三', role: 'pmo', status: 'active' }],
        projects: [],
        sprints: [],
        requirements: [],
        milestones: [],
        timelineNodes: [],
        auditLogs: [],
      },
      checksum: 'manual',
    };
    repository.replaceBackups([backup]);
    assert.equal(repository.listBackups()[0].checksum, 'manual');
  } finally {
    repository.close();
  }
});
