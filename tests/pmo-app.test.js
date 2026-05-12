import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = [
  '../src/pages/home-page.js',
  '../src/pages/secondary-pages.js',
  '../src/pages/tertiary-pages.js',
  '../src/pages/user-management-page.js',
  '../src/pages/data-backup-page.js',
  '../src/main.js',
].map((file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8')).join('\n');

function createRuntime(savedState = null, { blockStorage = false, meta = null, initialHash = '', protocol = '', fetch = null } = {}) {
  const listeners = {};
  const store = new Map();
  const downloads = [];
  if (savedState) store.set('pmo-sprint-api-cache-v2', JSON.stringify(savedState));

  const app = {
    innerHTML: '',
    addEventListener(type, handler) {
      listeners[type] = handler;
    },
    querySelector() {
      return null;
    },
  };

  class FakeFormData {
    constructor(form) {
      this.form = form || { fields: {} };
    }

    get(key) {
      return this.form.fields?.[key] || '';
    }

    entries() {
      return Object.entries(this.form.fields || {});
    }
  }

  const context = {
    console,
    structuredClone,
    FormData: FakeFormData,
    Blob: class {
      constructor(parts, options = {}) {
        this.parts = parts;
        this.type = options.type;
      }
    },
    URL: {
      createObjectURL() {
        return 'blob:test';
      },
      revokeObjectURL() {},
    },
    document: {
      querySelector(selector) {
        return selector === '#app' ? app : null;
      },
      createElement(tag) {
        return {
          tag,
          href: '',
          download: '',
          click() {
            downloads.push({ href: this.href, download: this.download });
          },
        };
      },
    },
    window: {
      PMO_META: meta,
      location: { hash: initialHash, protocol },
      history: {
        replaceState(_state, _title, hash) {
          context.window.location.hash = hash;
        },
      },
      localStorage: {
        getItem(key) {
          return store.get(key) || null;
        },
        setItem(key, value) {
          if (blockStorage) throw new Error('simulated blocked storage');
          store.set(key, String(value));
        },
      },
      setTimeout() {},
      confirm() {
        return true;
      },
    },
  };
  if (fetch) context.window.fetch = fetch;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(source, context);
  return { app, context, listeners, store, downloads };
}

function click(listeners, action, dataset = {}) {
  const target = {
    dataset: { action, ...dataset },
    closest() {
      return this;
    },
  };
  listeners.click({ target });
}

async function changeFile(listeners, id, file) {
  await listeners.change({
    target: {
      id,
      files: [file],
      value: 'backup.json',
      dataset: {},
    },
  });
}

function submit(listeners, formName, fields) {
  listeners.submit({
    preventDefault() {},
    target: {
      dataset: { form: formName },
      fields,
      querySelector() {
        return null;
      },
    },
  });
}

function storedState(store) {
  return JSON.parse(store.get('pmo-sprint-api-cache-v2'));
}

async function flushAsyncWork() {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

test('strict account login works through standard form submit when preview storage writes are blocked', () => {
  const { app, listeners } = createRuntime(null, { blockStorage: true });

  assert.match(app.innerHTML, /login-page/);
  submit(listeners, 'login', { account: '', password: '' });
  assert.match(app.innerHTML, /请输入完整的用户账号和密码/);
  assert.match(app.innerHTML, /login-page/);

  submit(listeners, 'login', { account: 'zhangsan', password: '123456' });
  assert.doesNotMatch(app.innerHTML, /login-page/);
  assert.match(app.innerHTML, /system-sidebar/);
});

test('login uses a plain account input without dropdown suggestions', () => {
  const savedState = {
    users: [
      { id: 'u-x', name: '新成员', account: 'newmember', password: 'pw', role: 'member', status: 'active' },
    ],
  };
  const { app } = createRuntime(savedState);

  assert.match(app.innerHTML, /name="account" type="text"/);
  assert.match(app.innerHTML, /placeholder="请输入用户账号"/);
  assert.doesNotMatch(app.innerHTML, /<datalist/);
  assert.doesNotMatch(app.innerHTML, /list="login-users"/);
  assert.doesNotMatch(app.innerHTML, /newmember · 新成员 · 成员/);
  assert.doesNotMatch(app.innerHTML, /例如 zhangsan/);
});

test('legacy preview user data is migrated without clearing business data', () => {
  const { app, listeners, store } = createRuntime({
    users: [
      { id: 'u-1', name: '张三', account: 'old-admin', password: 'wrong', role: 'member', status: 'paused' },
      { id: 'u-custom', name: '业务用户', account: 'businessuser', password: 'pw', role: 'member', status: 'active' },
    ],
    projects: [{ id: 'p-custom', name: '保留项目', owner: 'u-1', members: ['u-1'], status: 'active', startDate: '2026-05-01', endDate: '2026-05-30' }],
  });

  submit(listeners, 'login', { account: 'zhangsan', password: '123456' });

  assert.doesNotMatch(app.innerHTML, /login-page/);
  const saved = storedState(store);
  assert.equal(saved.authSeedVersion, 1);
  assert.equal(saved.users.some((user) => user.account === 'businessuser'), true);
  assert.equal(saved.projects.some((project) => project.id === 'p-custom'), true);
});

test('corrupted seeded preview credentials self-heal during login', () => {
  const { app, listeners, store } = createRuntime({
    authSeedVersion: 1,
    users: [
      { id: 'u-1', name: '张三', account: 'old-admin', password: 'wrong', role: 'member', status: 'paused' },
    ],
    projects: [{ id: 'p-preview', name: '预览保留项目', owner: 'u-1', members: ['u-1'], status: 'active', startDate: '2026-05-01', endDate: '2026-05-30' }],
  });

  submit(listeners, 'login', { account: 'zhangsan', password: '123456' });

  assert.doesNotMatch(app.innerHTML, /login-page/);
  const saved = storedState(store);
  assert.equal(saved.users.some((user) => user.account === 'old-admin'), true);
  assert.equal(saved.users.some((user) => user.account === 'zhangsan' && user.status === 'active'), true);
  assert.equal(saved.projects.some((project) => project.id === 'p-preview'), true);
});

test('current user credentials are not reset after auth seed migration has run', () => {
  const { app, listeners } = createRuntime({
    authSeedVersion: 1,
    users: [
      { id: 'u-1', name: '张三', account: 'zhangsan', password: 'custompass', role: 'pmo', status: 'active', authManaged: true },
    ],
  });

  submit(listeners, 'login', { account: 'zhangsan', password: '123456' });
  assert.match(app.innerHTML, /用户账号或密码不正确，或账号未启用/);
  submit(listeners, 'login', { account: 'zhangsan', password: 'custompass' });
  assert.doesNotMatch(app.innerHTML, /login-page/);
});

test('role permissions render as PMO full access, PM project operations, member read-only', () => {
  const pmo = createRuntime({ currentUserId: 'u-1' }).app.innerHTML;
  assert.match(pmo, /data-action="new-project"/);
  assert.match(pmo, /成员管理/);
  assert.match(pmo, /数据备份/);

  const pm = createRuntime({ currentUserId: 'u-2' }).app.innerHTML;
  assert.doesNotMatch(pm, /data-action="new-project"/);
  assert.match(pm, /编辑项目/);
  assert.match(pm, /\+ Sprint/);
  assert.match(pm, /成员管理/);
  assert.doesNotMatch(pm, /数据备份/);

  const member = createRuntime({ currentUserId: 'u-3' }).app.innerHTML;
  assert.doesNotMatch(member, /成员管理/);
  assert.doesNotMatch(member, /数据备份/);
  assert.doesNotMatch(member, /编辑项目/);
  assert.doesNotMatch(member, /\+ Sprint/);
});

test('PM can view but cannot modify system users', () => {
  const { app, listeners } = createRuntime({ currentUserId: 'u-2' });

  click(listeners, 'open-users');
  assert.match(app.innerHTML, /系统用户|项目成员/);
  assert.match(app.innerHTML, /zhangsan/);
  assert.match(app.innerHTML, /lisi/);
  assert.match(app.innerHTML, /wangwu/);
  assert.doesNotMatch(app.innerHTML, /data-action="new-user"/);
  assert.doesNotMatch(app.innerHTML, /data-action="edit-user"/);
  assert.doesNotMatch(app.innerHTML, /data-action="delete-user"/);
  assert.match(app.innerHTML, /<button class="link-button" disabled>编辑<\/button>/);
  assert.match(app.innerHTML, /<button class="link-button danger" disabled>删除<\/button>/);

  click(listeners, 'new-user');
  assert.doesNotMatch(app.innerHTML, /data-form="user"/);
  assert.match(app.innerHTML, /只有 PMO 可以新增和编辑用户/);

  submit(listeners, 'user', {
    account: 'pmblocked',
    name: 'PM 禁止创建',
    password: 'abc123',
    confirmPassword: 'abc123',
    role: 'member',
    status: 'active',
  });
  assert.match(app.innerHTML, /只有 PMO 可以保存用户/);
  assert.doesNotMatch(app.innerHTML, /pmblocked/);

  click(listeners, 'delete-user', { id: 'u-3' });
  assert.match(app.innerHTML, /只有 PMO 可以删除用户/);
  assert.match(app.innerHTML, /wangwu/);
});

test('user management list is sorted by PMO, PM, then members', () => {
  const { app, listeners } = createRuntime({
    currentUserId: 'u-pmo-a',
    users: [
      { id: 'u-member-z', name: '赵敏', account: 'zhaomin', password: '123456', role: 'member', status: 'active' },
      { id: 'u-pm-a', name: '李四', account: 'lisi', password: '123456', role: 'pm', status: 'active' },
      { id: 'u-pmo-a', name: '张三', account: 'zhangsan', password: '123456', role: 'pmo', status: 'active' },
      { id: 'u-member-a', name: '王五', account: 'wangwu', password: '123456', role: 'member', status: 'active' },
    ],
  });

  click(listeners, 'open-users');
  const html = app.innerHTML.match(/<tbody>[\s\S]*<\/tbody>/)?.[0] || '';
  assert.equal(html.indexOf('zhangsan') < html.indexOf('lisi'), true);
  assert.equal(html.indexOf('lisi') < html.indexOf('wangwu'), true);
  assert.equal(html.indexOf('wangwu') < html.indexOf('zhaomin'), true);
});

test('opening a sprint detail syncs the owning project before rendering detail page', () => {
  const savedState = {
    currentUserId: 'u-1',
    selectedProjectId: 'p-1',
    selectedSprintId: 's-1',
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
        acceptanceCriteria: '可以创建项目、创建 Sprint，并配置需求、里程碑和时间轴节点。',
        teams: ['产品', '研发', '测试'],
      },
      {
        id: 's-2',
        projectId: 'p-2',
        name: 'Sprint 2 - 财务流程梳理',
        goal: '完成财务流程改造需求梳理。',
        description: '面向财务自动化项目的 Sprint。',
        owner: 'u-2',
        status: 'not_started',
        priority: 'medium',
        startDate: '2026-06-03',
        endDate: '2026-06-17',
        acceptanceCriteria: '形成流程清单。',
        teams: ['产品', '数据'],
      },
    ],
  };
  const { app, listeners } = createRuntime(savedState);

  assert.match(app.innerHTML, /Sprint 2 - 财务流程梳理/);
  click(listeners, 'open-sprint', { id: 's-2' });
  assert.match(app.innerHTML, /detail-page/);
  assert.match(app.innerHTML, /Sprint 2 - 财务流程梳理/);
  assert.match(app.innerHTML, /当前项目：财务自动化流程改造/);
  assert.doesNotMatch(app.innerHTML, /当前项目：企业客户项目看板 MVP/);
});

test('PMO can create a project from the drawer workflow', () => {
  const { app, listeners } = createRuntime({ currentUserId: 'u-1' });

  click(listeners, 'new-project');
  assert.match(app.innerHTML, /data-form="project"/);
  submit(listeners, 'project', {
    name: '新客户交付项目',
    owner: 'u-2',
    status: 'planning',
    startDate: '2026-07-01',
    endDate: '2026-08-01',
    goal: '验证 PMO 创建项目闭环。',
    description: '自动化用例创建。',
    'members.0.name': 'u-2',
  });

  assert.match(app.innerHTML, /新客户交付项目/);
  assert.doesNotMatch(app.innerHTML, /drawer open/);
});

test('PM can create a sprint in an owned project', () => {
  const { app, listeners } = createRuntime({ currentUserId: 'u-2', selectedProjectId: 'p-1' });

  click(listeners, 'new-sprint', { id: 'p-1' });
  assert.match(app.innerHTML, /Sprint 创建向导/);
  assert.match(app.innerHTML, /data-form="sprint-create"/);
  assert.match(app.innerHTML, /基础信息/);
  assert.match(app.innerHTML, /计划与里程碑/);
  assert.match(app.innerHTML, /关键需求/);
  submit(listeners, 'sprint-create', {
    name: 'Sprint PM 操作用例',
    owner: 'u-2',
    status: 'not_started',
    priority: 'medium',
    startDate: '2026-05-27',
    endDate: '2026-06-10',
    goal: '验证 PM 可以创建自己项目下的 Sprint。',
    businessGoal: '',
    deliveryGoal: '',
    qualityGoal: '',
    acceptanceCriteria: '保存后能进入 Sprint 列表。',
    riskNote: '',
  });

  assert.match(app.innerHTML, /Sprint PM 操作用例/);
});

test('member write operations are blocked even if events are triggered manually', () => {
  const { app, listeners } = createRuntime({ currentUserId: 'u-3', selectedProjectId: 'p-1' });

  assert.doesNotMatch(app.innerHTML, /编辑项目/);
  click(listeners, 'new-sprint', { id: 'p-1' });
  assert.doesNotMatch(app.innerHTML, /data-form="sprint"/);
  assert.match(app.innerHTML, /只有 PMO 或项目 PM 可以创建 Sprint/);

  click(listeners, 'new-project');
  assert.doesNotMatch(app.innerHTML, /data-form="project"/);
  assert.match(app.innerHTML, /只有 PMO 可以创建项目/);
});

test('user drawer uses account-only fields and validates password confirmation', () => {
  const { app, listeners, store, context } = createRuntime({ currentUserId: 'u-1' });

  click(listeners, 'open-users');
  assert.match(app.innerHTML, /<table class="user-table">/);
  assert.match(app.innerHTML, /<th>用户账号<\/th>/);
  assert.match(app.innerHTML, /<th>姓名<\/th>/);
  assert.match(app.innerHTML, /<th>角色<\/th>/);
  assert.match(app.innerHTML, /<th>状态<\/th>/);
  assert.match(app.innerHTML, /<th>操作<\/th>/);
  assert.match(app.innerHTML, /<button class="link-button danger" disabled>删除<\/button>/);
  click(listeners, 'new-user');
  assert.match(app.innerHTML, /data-form="user"/);
  assert.match(app.innerHTML, /<label>姓名<\/label>/);
  assert.match(app.innerHTML, /用户账号/);
  assert.doesNotMatch(app.innerHTML, /<label>邮箱<\/label>/);
  assert.doesNotMatch(app.innerHTML, /<label>状态<\/label>/);
  assert.match(app.innerHTML, /aria-label="关闭">×<\/button>/);

  submit(listeners, 'user', {
    account: 'newmember',
    name: '新成员',
    email: '',
    password: 'abc123',
    confirmPassword: 'abc124',
    role: 'member',
    status: 'active',
  });
  assert.match(app.innerHTML, /两次输入的密码不一致/);
  assert.match(app.innerHTML, /data-form="user"/);

  submit(listeners, 'user', {
    account: 'newmember',
    name: '新成员',
    email: '',
    password: 'abc123',
    confirmPassword: 'abc123',
    role: 'member',
    status: 'active',
  });
  assert.match(app.innerHTML, /newmember/);
  assert.doesNotMatch(app.innerHTML, /drawer open/);
  assert.equal(storedState(store).users.some((user) => user.account === 'newmember'), true);

  click(listeners, 'edit-user', { id: 'u-3' });
  assert.match(app.innerHTML, /新密码/);
  submit(listeners, 'user', {
    account: 'wangwu',
    name: '王五',
    email: '',
    password: 'newpass',
    confirmPassword: 'wrongpass',
    role: 'member',
    status: 'active',
  });
  assert.match(app.innerHTML, /两次输入的密码不一致/);
  submit(listeners, 'user', {
    account: 'wangwu',
    name: '王五',
    email: '',
    password: 'newpass',
    confirmPassword: 'newpass',
    role: 'member',
    status: 'active',
  });
  assert.equal(storedState(store).users.find((user) => user.id === 'u-3').password, 'newpass');

  click(listeners, 'logout');
  context.window.pmoLogin({
    preventDefault() {},
    stopPropagation() {},
    target: {
      closest() {
        return { fields: { account: 'wangwu', password: '123456' } };
      },
    },
  });
  assert.match(app.innerHTML, /用户账号或密码不正确/);

  context.window.pmoLogin({
    preventDefault() {},
    stopPropagation() {},
    target: {
      closest() {
        return { fields: { account: 'newmember', password: 'abc123' } };
      },
    },
  });
  assert.doesNotMatch(app.innerHTML, /login-page/);
  assert.match(app.innerHTML, /newmember/);
});

test('PMO can create, export, import, and restore data backups without clearing custom users', async () => {
  const { app, listeners, store, downloads } = createRuntime({ currentUserId: 'u-1' });

  click(listeners, 'open-users');
  click(listeners, 'new-user');
  submit(listeners, 'user', {
    id: 'u-backup',
    account: 'backupuser',
    name: '备份用户',
    password: 'abc123',
    confirmPassword: 'abc123',
    role: 'member',
    status: 'active',
  });
  click(listeners, 'open-data-backup');
  assert.match(app.innerHTML, /数据备份/);
  assert.match(app.innerHTML, /data-action="create-backup"/);
  assert.match(app.innerHTML, /data-action="export-backup"/);
  assert.match(app.innerHTML, /data-action="import-backup"/);
  click(listeners, 'create-backup');

  const backups = JSON.parse(store.get('pmo-sprint-api-backups-v1'));
  assert.equal(backups.length, 1);
  assert.equal(backups[0].summary.users, 5);
  assert.equal(backups[0].format, 'pmo-suite-backup');
  assert.match(backups[0].createdAt, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  assert.match(app.innerHTML, new RegExp(backups[0].createdAt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  click(listeners, 'export-backup', { id: backups[0].id });
  assert.equal(downloads.at(-1).download.startsWith('pmo-suite-backup-'), true);

  click(listeners, 'delete-user', { id: 'u-backup' });
  assert.equal(storedState(store).users.some((user) => user.id === 'u-backup'), false);

  click(listeners, 'restore-backup', { id: backups[0].id });
  assert.equal(storedState(store).users.some((user) => user.id === 'u-backup'), true);
  assert.match(app.innerHTML, /数据已从备份恢复/);

  click(listeners, 'delete-user', { id: 'u-backup' });
  assert.equal(storedState(store).users.some((user) => user.id === 'u-backup'), false);
  await changeFile(listeners, 'backup-file', {
    name: 'pmo-suite-backup.json',
    async text() {
      return JSON.stringify(backups[0]);
    },
  });
  assert.equal(storedState(store).users.some((user) => user.id === 'u-backup'), true);
});

test('page route hash restores first-level pages on refresh', () => {
  const { app, context } = createRuntime({ currentUserId: 'u-1' }, { initialHash: '#/dataBackup' });

  assert.match(app.innerHTML, /数据备份/);
  assert.match(app.innerHTML, /data-action="create-backup"/);
  assert.equal(context.window.location.hash, '#/dataBackup');
});

test('saved business data survives app metadata and schema updates', () => {
  const savedState = {
    schemaVersion: 0,
    currentUserId: 'u-custom',
    selectedProjectId: 'p-custom',
    selectedSprintId: '',
    users: [
      { id: 'u-custom', account: 'ownerone', password: 'pw', role: 'pmo', status: 'active' },
    ],
    projects: [
      {
        id: 'p-custom',
        name: '保留的业务项目',
        description: '用户已编辑的数据',
        owner: 'u-custom',
        members: ['u-custom'],
        status: 'active',
        startDate: '2026-05-01',
        endDate: '2026-05-31',
        goal: '验证版本更新不覆盖业务数据',
        teams: ['产品'],
      },
    ],
    sprints: [],
    milestones: [],
    requirements: [],
    timelineNodes: [],
  };
  const { app, store } = createRuntime(savedState);

  assert.match(app.innerHTML, /保留的业务项目/);
  assert.doesNotMatch(app.innerHTML, /企业客户项目看板 MVP/);
  assert.match(app.innerHTML, /ownerone/);
  assert.equal(storedState(store).projects[0].name, '保留的业务项目');
});

test('sidebar about and changelog open as secondary pages with Chinese release notes', () => {
  const meta = {
    version: '0.7.0',
    buildDate: '2026-05-11 20:05',
    dataSchema: 1,
    changelog: [
      {
        version: '0.7.1',
        commit: 'abc1234',
        date: '2026-05-11 20:04',
        message: 'Polish marked UI details',
        points: ['优化左侧信息浮层', '新增三级编辑页'],
      },
    ],
  };
  const { app, listeners } = createRuntime({ currentUserId: 'u-1' }, { meta });

  assert.match(app.innerHTML, /data-action="open-info-page" data-view="about"/);
  assert.match(app.innerHTML, /更新日志<\/span><strong>05\/11 20:04<\/strong>/);
  assert.doesNotMatch(app.innerHTML, /更新日志<\/span><strong>1 条<\/strong>/);
  assert.doesNotMatch(app.innerHTML, /<details class="sidebar-meta"/);

  click(listeners, 'open-info-page', { view: 'about' });
  assert.match(app.innerHTML, /PMO \/ About/);
  assert.match(app.innerHTML, /system-sidebar/);
  assert.match(app.innerHTML, /产品定位/);
  assert.match(app.innerHTML, /多 Agent 协同的 AI Native 项目管理系统/);
  assert.match(app.innerHTML, /项目与 Sprint 管理/);

  click(listeners, 'open-info-page', { view: 'changelog' });
  assert.match(app.innerHTML, /PMO \/ Changelog/);
  assert.match(app.innerHTML, /当前版本 0.7.0/);
  assert.match(app.innerHTML, /版本 0.7.1 · 2026-05-11 20:04/);
  assert.match(app.innerHTML, /2026-05-11 20:04/);
  assert.match(app.innerHTML, /优化左侧信息浮层/);
  assert.match(app.innerHTML, /新增三级编辑页/);
});

test('sprint edit actions drill down to scoped tertiary pages', () => {
  const { app, listeners, store } = createRuntime({ currentUserId: 'u-1', selectedProjectId: 'p-1', selectedSprintId: 's-1' });

  click(listeners, 'open-sprint', { id: 's-1' });
  click(listeners, 'edit-sprint-section', { id: 's-1', section: 'basic' });
  assert.match(app.innerHTML, /Sprint 三级编辑/);
  assert.match(app.innerHTML, /data-form="sprint-edit-basic"/);
  assert.doesNotMatch(app.innerHTML, /data-form="sprint"/);
  assert.doesNotMatch(app.innerHTML, /关键需求<\/h3>/);

  submit(listeners, 'sprint-edit-basic', {
    name: 'Sprint 1 - 基础信息已更新',
    owner: 'u-2',
    status: 'active',
    priority: 'high',
    startDate: '2026-05-12',
    endDate: '2026-05-26',
    description: '仅更新基础信息。',
    goal: '验证三级编辑页保存基础信息。',
    acceptanceCriteria: '基础信息可保存。',
    riskNote: '',
  });
  assert.match(app.innerHTML, /Sprint 1 - 基础信息已更新/);
  assert.equal(storedState(store).sprints.find((sprint) => sprint.id === 's-1').name, 'Sprint 1 - 基础信息已更新');

  click(listeners, 'edit-sprint-section', { id: 's-1', section: 'plan', add: 'milestones' });
  assert.match(app.innerHTML, /data-form="sprint-edit-plan"/);
  assert.match(app.innerHTML, /里程碑 3/);
  assert.doesNotMatch(app.innerHTML, /Sprint 名称/);
  submit(listeners, 'sprint-edit-plan', {
    'milestones.2.name': '上线复盘',
    'milestones.2.date': '2026-05-25',
    'milestones.2.owner': 'u-2',
    'milestones.2.status': 'not_started',
    'milestones.2.deliverable': '复盘纪要',
    'milestones.2.description': '新增里程碑',
  });
  assert.equal(storedState(store).milestones.some((item) => item.name === '上线复盘'), true);

  click(listeners, 'edit-sprint-section', { id: 's-1', section: 'requirements' });
  assert.match(app.innerHTML, /data-form="sprint-edit-requirements"/);
  assert.match(app.innerHTML, /WeTask 链接/);
  assert.doesNotMatch(app.innerHTML, /Sprint 名称/);
  submit(listeners, 'sprint-edit-requirements', {
    'requirements.0.wetaskUrl': 'https://wetask.example.com/requirements/REQ-001-updated',
  });
  assert.equal(
    storedState(store).requirements.find((item) => item.id === 'r-1').wetaskUrl,
    'https://wetask.example.com/requirements/REQ-001-updated',
  );
});

test('user management changes are immediately available in project member selectors', () => {
  const { app, listeners } = createRuntime({ currentUserId: 'u-1', selectedProjectId: 'p-1' });

  click(listeners, 'open-users');
  click(listeners, 'new-user');
  submit(listeners, 'user', {
    name: '陈晨',
    account: 'chenchen',
    email: '',
    password: 'abc123',
    confirmPassword: 'abc123',
    role: 'member',
    status: 'active',
  });
  assert.match(app.innerHTML, /chenchen/);
  assert.match(app.innerHTML, /陈晨/);

  click(listeners, 'open-overview');
  click(listeners, 'edit-project', { id: 'p-1' });
  assert.match(app.innerHTML, /陈晨 · 成员/);
  assert.doesNotMatch(app.innerHTML, /参与团队/);
  assert.doesNotMatch(app.innerHTML, /项目目标/);
});

test('sprint detail shows project name and risk note', () => {
  const { app, listeners } = createRuntime({ currentUserId: 'u-1', selectedProjectId: 'p-1', selectedSprintId: 's-1' });

  click(listeners, 'open-sprint', { id: 's-1' });
  assert.match(app.innerHTML, /企业客户项目看板/);
  assert.doesNotMatch(app.innerHTML, /Sprint 二级详情/);
  assert.match(app.innerHTML, /风险：<\/strong>时间轴拖拽暂不进入第一版/);
});

test('project cards remove rhythm labels and use aligned metadata blocks', () => {
  const { app } = createRuntime({ currentUserId: 'u-1' });

  assert.doesNotMatch(app.innerHTML, /节奏正常/);
  assert.doesNotMatch(app.innerHTML, />Project<\/p>/);
  assert.match(app.innerHTML, /class="project-compact-meta"/);
  assert.match(app.innerHTML, /<span>Owner<\/span><strong>李四<\/strong>/);
  assert.match(app.innerHTML, /<span>项目周期<\/span>/);
});

test('remote state saves include the last server base state and apply merged response', async () => {
  const baseState = {
    schemaVersion: 1,
    authSeedVersion: 1,
    revision: 7,
    view: 'overview',
    selectedProjectId: 'p-1',
    selectedSprintId: '',
    selectedRequirementId: '',
    selectedMilestoneId: '',
    search: '',
    projectStatus: 'all',
    sprintStatus: 'all',
    currentUserId: 'u-1',
    loginError: '',
    users: [
      { id: 'u-1', account: 'zhangsan', name: '张三', role: 'pmo', status: 'active', hasPassword: true },
    ],
    projects: [{ id: 'p-1', name: '基线项目', owner: 'u-1', members: ['u-1'], status: 'active' }],
    sprints: [],
    requirements: [],
    milestones: [],
    timelineNodes: [],
    auditLogs: [{ id: 'audit-base', at: '2026-05-12 10:00', event: 'base' }],
  };
  let savePayload = null;
  const fetch = async (url, options = {}) => {
    if (url === '/api/auth/me') {
      return {
        ok: true,
        async json() {
          return { state: structuredClone(baseState), backups: [] };
        },
      };
    }
    if (url === '/api/state') {
      savePayload = JSON.parse(options.body);
      return {
        ok: true,
        async json() {
          return {
            state: {
              ...savePayload.state,
              revision: 8,
              projects: savePayload.state.projects.concat({ id: 'p-2', name: '服务端合并项目', owner: 'u-1', members: ['u-1'], status: 'planning' }),
              auditLogs: savePayload.state.auditLogs.concat({ id: 'audit-server', at: '2026-05-12 10:01', event: 'server' }),
            },
          };
        },
      };
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };
  const { context, store } = createRuntime(null, { protocol: 'http:', fetch });

  await flushAsyncWork();
  vm.runInContext('apiClient.saveState({ ...state, search: "remote-search" }, "test.remote.save")', context);
  await flushAsyncWork();

  assert.equal(savePayload.revision, 7);
  assert.equal(savePayload.baseState.revision, 7);
  assert.equal(savePayload.baseState.projects[0].name, '基线项目');
  assert.equal(savePayload.state.search, 'remote-search');
  assert.equal(savePayload.state.users[0].password, '');
  const cached = storedState(store);
  assert.equal(cached.revision, 8);
  assert.equal(cached.projects.some((project) => project.id === 'p-2'), true);
});

test('active sprint card CSS uses inset stroke to avoid Chrome rounded border clipping', () => {
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  const cardBlock = css.match(/\.active-sprint-card \{[\s\S]*?\n\}/)?.[0] || '';
  const beforeBlock = css.match(/\.active-sprint-card::before \{[\s\S]*?\n\}/)?.[0] || '';
  const hoverBlock = css.match(/\.active-sprint-card:hover,[\s\S]*?\.active-sprint-card:focus \{[\s\S]*?\n\}/)?.[0] || '';

  assert.match(cardBlock, /border:\s*1px solid transparent;/);
  assert.doesNotMatch(cardBlock, /border-left:/);
  assert.match(cardBlock, /box-shadow:\s*inset 0 0 0 1px #ece1b7;/);
  assert.match(beforeBlock, /width:\s*5px;/);
  assert.match(beforeBlock, /background:\s*var\(--primary\);/);
  assert.match(hoverBlock, /box-shadow:\s*inset 0 0 0 1px #dfc553,/);
});
