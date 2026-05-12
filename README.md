# PMO Suite

PMO Suite 是一个开源项目管理系统，面向 PMO、项目 PM 和交付团队，用于统一维护项目、Sprint、成员、需求责任人与关键计划节点。

当前版本采用 Node.js + Express + SQLite 的单体应用形态。Express 托管前端静态资源并提供 REST API，业务数据持久化到 SQLite，适合本地部署、团队协作和后续持续迭代。

## 功能范围

- 项目增删改查
- Sprint 增删改查与二级详情页
- 系统级用户管理与角色模型
- 项目成员维护
- 需求编号、负责人、状态、优先级、WeTask 链接维护
- 里程碑与关键时间轴维护
- CSV / Excel 导入导出
- PMO 数据备份、备份文件导出和导入恢复
- Express REST API 与 SQLite 持久化
- 服务端登录会话、密码哈希、权限校验和审计日志
- 浏览器本地副本兜底，服务端不可用时不会阻断当前操作

## 技术栈

- HTML / CSS / JavaScript
- 无前端构建依赖
- Node.js / Express
- SQLite（通过 Node.js 内置 `node:sqlite`）

## 本地运行

安装依赖：

```bash
npm install
```

启动完整应用：

```bash
npm run start
```

开发模式会在服务端文件变化时自动重启：

```bash
npm run dev
```

然后访问：

```text
http://localhost:3000
```

SQLite 数据库默认写入：

```text
data/pmo-suite.sqlite
```

也可以通过环境变量指定数据库路径：

```bash
PMO_DB_PATH=/path/to/pmo-suite.sqlite npm run start
```

可选运行配置：

```bash
PORT=3000
PMO_DB_PATH=./data/pmo-suite.sqlite
PMO_SESSION_TTL_MS=28800000
NODE_ENV=production
LOG_LEVEL=info
```

也可以使用 Docker Compose 启动，SQLite 数据会保存在 Docker volume 中：

```bash
docker compose up -d
```

如只需要打开旧的纯静态预览，可使用：

```bash
npm run start:static
```

## 默认登录账号

登录使用用户账号。首次启动时如果 SQLite 中没有业务数据，系统会使用内置初始化数据；默认账号初始密码均为 `123456`：

- PMO：`zhangsan`
- PM：`lisi`
- 成员：`wangwu`

## 测试

```bash
npm test
```

当前 `npm test` 会执行 `src/main.js` 的 JavaScript 语法检查和核心功能用例。

## 数据与版本

业务数据通过 `/api/state` 保存到 SQLite。PMO 手动备份通过 `/api/backups` 保存到 SQLite，同时支持导出 JSON 备份文件到本地并在数据丢失后导入恢复。浏览器仍保留 `localStorage` 副本作为离线或服务端异常时的兜底，并会在服务端无数据时尝试迁移已有本地数据。应用版本、构建信息和更新日志独立保存在 `src/meta.js`，系统迭代不会因为版本号变化覆盖已有项目、Sprint、需求、里程碑和用户数据。

服务端会将用户密码转换为 `scrypt` 哈希后保存，并通过 HttpOnly Cookie 维护登录会话。写入接口会进行服务端权限校验：PMO 拥有全部权限，PM 仅能修改自己负责项目下的数据，成员仅可查看。SQLite 使用 `schema_migrations` 记录结构升级。业务状态保存采用 `revision + baseState` 三方合并机制：多人并发修改不同项目、Sprint、需求、里程碑、时间轴或用户记录时会自动合并；同一字段被同时修改时服务端拒绝静默覆盖并返回冲突信息，避免旧快照覆盖新数据。

当前 REST API：

- `GET /api/health`：服务健康检查
- `POST /api/setup`：首次初始化 PMO 管理员，仅数据库为空时可用
- `POST /api/auth/login`：账号密码登录并建立服务端会话
- `POST /api/auth/logout`：退出登录并清理会话
- `GET /api/auth/me`：读取当前登录用户、业务状态和备份
- `GET /api/state`：读取业务状态，需要登录
- `PUT /api/state`：保存业务状态并追加服务端审计日志，需要登录；首次初始化除外
- `GET /api/users`：读取脱敏用户列表，需要登录
- `GET /api/projects`：读取当前账号可见项目，需要登录
- `GET /api/projects/:id/sprints`：读取当前账号可见项目的 Sprint，需要登录
- `GET /api/backups`：读取备份列表，需要登录
- `PUT /api/backups`：保存备份列表，仅 PMO

## 持续集成

仓库包含 GitHub Actions CI：`.github/workflows/ci.yml`。每次 push 和 pull request 会执行：

```bash
npm ci
npm test
git diff --check
docker build -t pmo-suite-ci .
```

CI 还会启动一次 Express 服务并访问 `/api/health` 做 smoke test。Dependabot 每周检查 npm 依赖更新。

本仓库包含本地 Git hook，用于每次提交前自动刷新 `src/meta.js` 中的更新日志。首次克隆后执行：

```bash
npm run setup-hooks
```

如需手动刷新版本元信息：

```bash
npm run update-meta
```

## Git 协作建议

- `main`：稳定版本分支
- `feature/<name>`：功能开发分支
- `fix/<name>`：缺陷修复分支
- 合并前至少运行一次 `npm test`

## 开源许可

MIT License
