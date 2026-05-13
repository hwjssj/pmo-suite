window.PMO_META = {
  "version": "0.6.30",
  "buildDate": "2026-05-13 17:56",
  "dataSchema": 1,
  "changelog": [
    {
      "version": "0.6.30",
      "date": "2026-05-13 17:53",
      "message": "Unify sprint edit wizard and required validation",
      "points": [
        "根据提交「Unify sprint edit wizard and required validation」更新对应产品能力",
        "同步完善界面交互、数据处理或权限控制细节",
        "更新版本元数据，确保更新日志连续可追溯"
      ]
    },
    {
      "version": "0.6.29",
      "date": "2026-05-12 19:19",
      "message": "Resolve concurrent state merges and active sprint border",
      "points": [
        "新增基于 revision 和 baseState 的服务端三方合并，避免多人同时操作不同业务数据时互相覆盖",
        "同一业务字段发生并发冲突时返回冲突信息并保留服务端最新数据，阻止静默丢失",
        "修复 Chrome 144 下当前 Sprint 圆角色块底部描边渲染异常"
      ]
    },
    {
      "version": "0.6.28",
      "date": "2026-05-12 15:58",
      "message": "Complete deployment iteration foundations",
      "points": [
        "补齐 Docker、环境变量模板、开发启动脚本和结构化日志，为持续运行提供标准部署入口",
        "SQLite 在保留快照兼容层的同时同步关系表，并增强健康检查、备份 checksum 和首次初始化接口",
        "增强 CI、Dependabot、PR 模板和资源级只读 API 雏形，为稳定迭代和后续资源 API 改造打基础"
      ]
    },
    {
      "version": "0.6.27",
      "date": "2026-05-12 14:15",
      "message": "Harden auth permissions and deployment foundations",
      "points": [
        "新增服务端登录会话、密码哈希和安全状态脱敏，降低明文密码与前端鉴权风险",
        "为 SQLite 增加 schema migrations、revision 乐观锁和 session 存储，提升持续迭代与并发保存安全性",
        "补充服务端权限校验、仓储安全测试和 GitHub Actions CI，阻止无权限快照写入并自动验证提交质量"
      ]
    },
    {
      "version": "0.6.26",
      "date": "2026-05-12 12:08",
      "message": "Add Express SQLite backend",
      "points": [
        "新增 Node.js + Express 后端，统一托管前端静态资源与 REST API",
        "新增 SQLite 持久化仓储，业务状态和 PMO 备份从浏览器本地存储升级为服务端保存",
        "前端数据层优先连接服务端接口，并保留 localStorage 作为离线兜底和历史数据迁移来源"
      ]
    },
    {
      "version": "0.6.25",
      "date": "2026-05-12 00:10",
      "message": "Restrict PM user management and align timestamps",
      "points": [
        "PM 成员管理调整为只读查看，用户新增、编辑和删除仅 PMO 可操作",
        "成员管理列表按 PMO、PM、成员顺序展示，便于识别账号权限层级",
        "数据备份时间与版本日志时间统一为 YYYY-MM-DD HH:mm 格式"
      ]
    },
    {
      "version": "0.6.24",
      "date": "2026-05-12 00:00",
      "message": "Expand backup portability and product positioning",
      "points": [
        "备份范围覆盖核心业务数据、审计日志和可选体验状态",
        "新增 PMO 备份文件导出和导入恢复能力，降低本地或服务端存储异常造成的数据丢失风险",
        "移除产品 MVP 定位表述，并优化成员管理表格列宽与间距"
      ]
    },
    {
      "version": "0.6.23",
      "date": "2026-05-11 23:43",
      "message": "Split pages and backup navigation",
      "points": [
        "将首页、二级页面、三级页面、用户管理和数据备份拆分为语义化页面文件",
        "数据备份升级为 PMO 独立一级菜单，成员管理仅保留用户管理职责",
        "新增 URL hash 页面同步，刷新后可保持当前页面位置"
      ]
    },
    {
      "version": "0.6.22",
      "date": "2026-05-11 23:30",
      "message": "Add non-destructive backups and recovery",
      "points": [
        "新增 PMO 手动数据备份与恢复能力，支持用户数据丢失后从本地快照恢复",
        "修正内置账号恢复策略，避免覆盖已有用户记录和自定义成员信息",
        "优化项目图标主色搭配、Sprint 按钮样式和成员表格操作列对齐"
      ]
    },
    {
      "version": "0.6.21",
      "date": "2026-05-11 23:11",
      "message": "Harden preview login and release changelog",
      "points": [
        "增强右侧预览登录自愈能力，修复残留错误用户数据导致的登录失败",
        "项目卡片图标背景改为纯色，统一视觉风格",
        "更新日志改为全量记录、逐次递增版本号和具体中文更新点",
        "左侧菜单更新日志入口改为显示最近更新时间"
      ]
    },
    {
      "version": "0.6.20",
      "date": "2026-05-11 23:01",
      "message": "Migrate legacy preview login users",
      "points": [
        "修复右侧预览残留旧用户数据导致默认账号无法登录的问题",
        "新增内置账号认证数据迁移，保留项目、Sprint、需求等业务数据",
        "补充旧预览数据迁移与密码保护测试"
      ]
    },
    {
      "version": "0.6.19",
      "date": "2026-05-11 22:56",
      "message": "Fix preview login and table permissions",
      "points": [
        "将登录页改为标准表单提交，提升右侧预览登录稳定性",
        "成员管理表格增加无权限禁用态",
        "优化关于我们与二级、三级页面底部间距"
      ]
    },
    {
      "version": "0.6.18",
      "date": "2026-05-11 22:39",
      "message": "Add sprint creation wizard and user table",
      "points": [
        "新建 Sprint 改为二级下钻页面",
        "新增基础信息、计划与里程碑、关键需求三步创建向导",
        "成员管理列表改为表格呈现"
      ]
    },
    {
      "version": "0.6.17",
      "date": "2026-05-11 22:19",
      "message": "Polish project cards and login account sync",
      "points": [
        "优化首页项目卡片布局，提升 Owner、周期、Sprint 等信息可读性",
        "移除项目节奏冗余标签和 Project 字段",
        "登录账号输入与系统用户账号保持同步"
      ]
    },
    {
      "version": "0.6.16",
      "date": "2026-05-11 22:04",
      "message": "Refine forms and synchronized member data",
      "points": [
        "项目成员选择与成员管理数据即时联动",
        "用户表单新增姓名与账号字段规范",
        "Sprint 详情页补充风险说明展示"
      ]
    },
    {
      "version": "0.6.15",
      "date": "2026-05-11 20:17",
      "message": "Use secondary info pages and add favicon",
      "points": [
        "关于我们和更新日志改为二级页面呈现",
        "新增浏览器页签 favicon",
        "产品定位更新为多 Agent 协同的 AI Native 项目管理系统"
      ]
    },
    {
      "version": "0.6.14",
      "date": "2026-05-11 19:54",
      "message": "Add info popovers and scoped sprint edit pages",
      "points": [
        "新增关于我们、版本信息和更新日志入口",
        "Sprint 编辑改为按基础信息、计划、需求分区下钻",
        "更新日志改为中文更新点展示"
      ]
    },
    {
      "version": "0.6.13",
      "date": "2026-05-11 19:34",
      "message": "Polish marked UI details",
      "points": [
        "优化登录页、侧边栏和按钮视觉细节",
        "精简 Sprint 详情页重复信息",
        "强化 WeTask 链接展示"
      ]
    },
    {
      "version": "0.6.12",
      "date": "2026-05-11 19:27",
      "message": "Refine user management and release metadata",
      "points": [
        "优化系统级用户管理表单",
        "新增版本信息与更新日志元数据",
        "保护业务数据避免被系统更新覆盖"
      ]
    },
    {
      "version": "0.6.11",
      "date": "2026-05-11 19:01",
      "message": "Add functional coverage for sprint detail flow",
      "points": [
        "补充 Sprint 详情页功能用例",
        "验证项目与 Sprint 关联切换"
      ]
    },
    {
      "version": "0.6.10",
      "date": "2026-05-11 18:08",
      "message": "Use account login and fixed sidebar layout",
      "points": [
        "切换为用户账号登录",
        "固定左侧系统菜单高度与滚动结构"
      ]
    },
    {
      "version": "0.6.9",
      "date": "2026-05-11 17:42",
      "message": "Refine sidebar account actions and permissions",
      "points": [
        "优化侧边栏账号与退出操作",
        "完善 PMO、PM、成员权限展示"
      ]
    },
    {
      "version": "0.6.8",
      "date": "2026-05-11 17:30",
      "message": "Fix preview login without bypassing auth",
      "points": [
        "修复预览窗口登录问题",
        "保留正常账号密码校验逻辑"
      ]
    },
    {
      "version": "0.6.7",
      "date": "2026-05-11 17:17",
      "message": "Fix preview login entry",
      "points": [
        "修复预览环境登录入口响应",
        "保持账号密码校验流程不绕过"
      ]
    },
    {
      "version": "0.6.6",
      "date": "2026-05-11 17:04",
      "message": "Add direct login click fallback",
      "points": [
        "新增登录按钮直接点击兜底逻辑",
        "提升内嵌预览环境登录稳定性"
      ]
    },
    {
      "version": "0.6.5",
      "date": "2026-05-11 16:55",
      "message": "Handle login via explicit click action",
      "points": [
        "补充显式登录点击事件处理"
      ]
    },
    {
      "version": "0.6.4",
      "date": "2026-05-11 16:36",
      "message": "Allow debug login from empty login form",
      "points": [
        "增加早期调试登录能力"
      ]
    },
    {
      "version": "0.6.3",
      "date": "2026-05-11 16:27",
      "message": "Refine login page presentation",
      "points": [
        "优化登录页视觉呈现"
      ]
    },
    {
      "version": "0.6.2",
      "date": "2026-05-11 16:18",
      "message": "Add login and role-based permissions",
      "points": [
        "新增登录模块",
        "增加基于角色的权限控制"
      ]
    },
    {
      "version": "0.6.1",
      "date": "2026-05-11 15:37",
      "message": "Initial open source PMO Suite MVP",
      "points": [
        "初始化 PMO Suite 单页 MVP",
        "实现项目、Sprint、成员、需求和里程碑基础管理",
        "建立本地可部署的开源项目结构"
      ]
    }
  ]
};
