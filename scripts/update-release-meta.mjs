import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const log = execFileSync('git', ['log', '--date=format-local:%Y-%m-%d %H:%M', '--pretty=format:%h%x09%ad%x09%s'], {
  encoding: 'utf8',
});

const zhSummary = {
  'Resolve concurrent state merges and active sprint border': ['新增基于 revision 和 baseState 的服务端三方合并，避免多人同时操作不同业务数据时互相覆盖', '同一业务字段发生并发冲突时返回冲突信息并保留服务端最新数据，阻止静默丢失', '修复 Chrome 144 下当前 Sprint 圆角色块底部描边渲染异常'],
  'Complete deployment iteration foundations': ['补齐 Docker、环境变量模板、开发启动脚本和结构化日志，为持续运行提供标准部署入口', 'SQLite 在保留快照兼容层的同时同步关系表，并增强健康检查、备份 checksum 和首次初始化接口', '增强 CI、Dependabot、PR 模板和资源级只读 API 雏形，为稳定迭代和后续资源 API 改造打基础'],
  'Harden auth permissions and deployment foundations': ['新增服务端登录会话、密码哈希和安全状态脱敏，降低明文密码与前端鉴权风险', '为 SQLite 增加 schema migrations、revision 乐观锁和 session 存储，提升持续迭代与并发保存安全性', '补充服务端权限校验、仓储安全测试和 GitHub Actions CI，阻止无权限快照写入并自动验证提交质量'],
  'Add Express SQLite backend': ['新增 Node.js + Express 后端，统一托管前端静态资源与 REST API', '新增 SQLite 持久化仓储，业务状态和 PMO 备份从浏览器本地存储升级为服务端保存', '前端数据层优先连接服务端接口，并保留 localStorage 作为离线兜底和历史数据迁移来源'],
  'Restrict PM user management and align timestamps': ['PM 成员管理调整为只读查看，用户新增、编辑和删除仅 PMO 可操作', '成员管理列表按 PMO、PM、成员顺序展示，便于识别账号权限层级', '数据备份时间与版本日志时间统一为 YYYY-MM-DD HH:mm 格式'],
  'Expand backup portability and product positioning': ['备份范围覆盖核心业务数据、审计日志和可选体验状态', '新增 PMO 备份文件导出和导入恢复能力，降低本地或服务端存储异常造成的数据丢失风险', '移除产品 MVP 定位表述，并优化成员管理表格列宽与间距'],
  'Split pages and backup navigation': ['将首页、二级页面、三级页面、用户管理和数据备份拆分为语义化页面文件', '数据备份升级为 PMO 独立一级菜单，成员管理仅保留用户管理职责', '新增 URL hash 页面同步，刷新后可保持当前页面位置'],
  'Add non-destructive backups and recovery': ['新增 PMO 手动数据备份与恢复能力，支持用户数据丢失后从本地快照恢复', '修正内置账号恢复策略，避免覆盖已有用户记录和自定义成员信息', '优化项目图标主色搭配、Sprint 按钮样式和成员表格操作列对齐'],
  'Harden preview login and release changelog': ['增强右侧预览登录自愈能力，修复残留错误用户数据导致的登录失败', '项目卡片图标背景改为纯色，统一视觉风格', '更新日志改为全量记录、逐次递增版本号和具体中文更新点', '左侧菜单更新日志入口改为显示最近更新时间'],
  'Migrate legacy preview login users': ['修复右侧预览残留旧用户数据导致默认账号无法登录的问题', '新增内置账号认证数据迁移，保留项目、Sprint、需求等业务数据', '补充旧预览数据迁移与密码保护测试'],
  'Fix preview login and table permissions': ['将登录页改为标准表单提交，提升右侧预览登录稳定性', '成员管理表格增加无权限禁用态', '优化关于我们与二级、三级页面底部间距'],
  'Add sprint creation wizard and user table': ['新建 Sprint 改为二级下钻页面', '新增基础信息、计划与里程碑、关键需求三步创建向导', '成员管理列表改为表格呈现'],
  'Polish project cards and login account sync': ['优化首页项目卡片布局，提升 Owner、周期、Sprint 等信息可读性', '移除项目节奏冗余标签和 Project 字段', '登录账号输入与系统用户账号保持同步'],
  'Refine forms and synchronized member data': ['项目成员选择与成员管理数据即时联动', '用户表单新增姓名与账号字段规范', 'Sprint 详情页补充风险说明展示'],
  'Use secondary info pages and add favicon': ['关于我们和更新日志改为二级页面呈现', '新增浏览器页签 favicon', '产品定位更新为多 Agent 协同的 AI Native 项目管理系统'],
  'Add info popovers and scoped sprint edit pages': ['新增关于我们、版本信息和更新日志入口', 'Sprint 编辑改为按基础信息、计划、需求分区下钻', '更新日志改为中文更新点展示'],
  'Polish marked UI details': ['优化登录页、侧边栏和按钮视觉细节', '精简 Sprint 详情页重复信息', '强化 WeTask 链接展示'],
  'Refine user management and release metadata': ['优化系统级用户管理表单', '新增版本信息与更新日志元数据', '保护业务数据避免被系统更新覆盖'],
  'Add functional coverage for sprint detail flow': ['补充 Sprint 详情页功能用例', '验证项目与 Sprint 关联切换'],
  'Use account login and fixed sidebar layout': ['切换为用户账号登录', '固定左侧系统菜单高度与滚动结构'],
  'Refine sidebar account actions and permissions': ['优化侧边栏账号与退出操作', '完善 PMO、PM、成员权限展示'],
  'Fix preview login without bypassing auth': ['修复预览窗口登录问题', '保留正常账号密码校验逻辑'],
  'Fix preview login entry': ['修复预览环境登录入口响应', '保持账号密码校验流程不绕过'],
  'Add direct login click fallback': ['新增登录按钮直接点击兜底逻辑', '提升内嵌预览环境登录稳定性'],
  'Handle login via explicit click action': ['补充显式登录点击事件处理'],
  'Allow debug login from empty login form': ['增加早期调试登录能力'],
  'Refine login page presentation': ['优化登录页视觉呈现'],
  'Add login and role-based permissions': ['新增登录模块', '增加基于角色的权限控制'],
  'Initial open source PMO Suite MVP': ['初始化 PMO Suite 单页 MVP', '实现项目、Sprint、成员、需求和里程碑基础管理', '建立本地可部署的开源项目结构'],
};

function fallbackPoints(message) {
  return [
    `根据提交「${message}」更新对应产品能力`,
    '同步完善界面交互、数据处理或权限控制细节',
    '更新版本元数据，确保更新日志连续可追溯',
  ];
}

function versionAt(total, index) {
  return `0.6.${total - index}`;
}

function currentMinute(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

const rawEntries = log
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line, index, rows) => {
    const [commit, date, ...messageParts] = line.split('\t');
    const message = messageParts.join('\t');
    return {
      version: versionAt(rows.length, index),
      date,
      message,
      points: zhSummary[message] || fallbackPoints(message),
    };
  });

const buildDate = currentMinute();
const pendingMessage = process.env.PMO_PENDING_RELEASE_MESSAGE;
const entries = rawEntries.length ? rawEntries : [];
if (pendingMessage) {
  entries.unshift({
    version: versionAt(entries.length + 1, 0),
    date: buildDate,
    message: pendingMessage,
    points: zhSummary[pendingMessage] || fallbackPoints(pendingMessage),
  });
}

const content = `window.PMO_META = ${JSON.stringify({
  version: entries[0]?.version || '0.6.0',
  buildDate,
  dataSchema: 1,
  changelog: entries,
}, null, 2)};\n`;

writeFileSync(new URL('../src/meta.js', import.meta.url), content);
