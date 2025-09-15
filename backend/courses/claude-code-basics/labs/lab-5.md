# 实验 2：Claude Code 开发个人网站

## 🎯 实验目标

通过本实验，您将学会：
- 使用 Claude Code 开发一个现代化的个人网站

## 📋 前置条件

### 环境要求
- **操作系统**: Windows 10+, macOS 10.15+, 或 Linux
- **Node.js**: 版本 18.0 或更高
- **网络**: 稳定的互联网连接
- **Python**: 版本 3.12 或更高

### 准备工作
1. 个人网站设计思路或者要求

## 🔨 实验步骤

### 使用 CLAUDE.md

#### CLAUDE.md template

```markdown
# CLAUDE.md — {{ProjectName}}（网站开发）

> 目的：告诉 Claude（和新同事）这个网站如何开发、测试、发布，以及**应该与不应该**做什么。  
> 生效范围：根目录（子目录可放置嵌套 CLAUDE.md 做更细粒度指导）。

---

## 1) 项目速览（Overview）
- 站点类型：{{MarketingSite | SaaS Dashboard | Docs | Blog | E-commerce | …}}
- 目标用户 & 关键路径：{{登录→浏览→下单}} / {{搜索→阅读→注册}} …
- 技术栈：{{Next.js 15 + React 19 + TypeScript 5}}，打包：{{Turbopack/Vite/Webpack}}  
- 运行要求：Node {{>= 20.x}}，包管理器：{{pnpm/yarn/npm}}  
- 单一命令：
  - `pnpm i` 安装依赖
  - `pnpm dev` 本地开发（http://localhost:{{3000}}）
  - `pnpm test` 单元/组件测试
  - `pnpm e2e` 端到端测试（{{Playwright/Cypress}}）
  - `pnpm build && pnpm start` 生产构建与本地预览
  - `pnpm lint` Lint / `pnpm typecheck` 类型检查
- 入口/重要目录：
  - `src/app` 路由与页面（如 Next.js）
  - `src/components` 复用组件（必须配 Storybook/单测）
  - `src/styles` 全局样式与设计令牌（Design Tokens）
  - `public/` 静态资源（图片走 CDN，尽量 `next/image` 或现代格式）
  - `scripts/` 工程脚本（可供 Claude 调用）

---

## 2) 开发规则（Coding Rules）
- 语言：**TypeScript 强制**，`strict` 打开；禁止 `any`/`@ts-ignore`（除非在代码旁说明原因与到期时间）
- 代码风格：ESLint + Prettier（提交前自动修复）
- 组件约定：
  - 采用无状态优先（Server Components/SSR 优先，必要时 CSR）
  - UI 来自 `@/components/ui/*`（{{shadcn/ui}} 或团队 Design System）
  - 所有可视组件**必须**有 Storybook 示例与可访问性属性（ARIA/label）
- 数据与网络：
  - API 调用集中于 `src/lib/api/*`；统一错误处理与重试
  - 严禁在组件内直接写 `fetch`（除非是 Server Component 的“安全”场景）
- 国际化（i18n）/ 多语言：{{next-intl}}，文案集中管理于 `src/i18n/*`
- 提交规范：Conventional Commits（如 `feat: …` / `fix: …`）
- 分支策略：{{Trunk-Based}} / {{GitHub Flow}}；禁止直接向 `main` 推送

---

## 3) 性能基线（Performance Budgets）
- **Core Web Vitals 目标（生产）**：
  - LCP ≤ **2.5s**
  - INP ≤ **200ms**
  - CLS ≤ **0.1**
- 资源预算（示例，按需调整）：
  - 首屏 JS ≤ **170 KB gzip**（第三方脚本需白名单）
  - 首屏 CSS ≤ **60 KB gzip**（模块化/按需/原子化）
  - 图片：优先 **AVIF/WebP**，必须尺寸声明与懒加载
- 构建优化：按路由/组件拆分、避免客户端无意义水合、移除未使用代码（`analyze` 脚本保留）

> 命令：`pnpm analyze` 导出 bundle 报告并请 Claude 解读瓶颈与建议。

---

## 4) 无障碍（A11y）
- 目标符合 **WCAG 2.2 AA**。  
- 基线要求：语义化 HTML、键盘可达/焦点可见、对比度合规、可感知的状态变化（ARIA Live）、表单标签/错误提示完善。  
- 开发自检脚本：`pnpm a11y`（Lighthouse/axe）并输出报告到 `./reports/a11y/*`。

---

## 5) SEO 与元数据（SEO/Metadata）
- 结构化数据：默认使用 **JSON-LD**（脚本注入 head），类型：{{Organization | Product | Article | BreadcrumbList | SitelinksSearchBox}}  
- `robots.txt` 与 `sitemap.xml` 自动生成；敏感路径用 `noindex` 而非仅 robots 屏蔽  
- 基础：唯一 `<title>`、规范化链接 `rel="canonical"`、Open Graph / Twitter Cards 完整

---

## 6) 安全（Security）
- **CSP（Content-Security-Policy）**：采用 **严格策略**，启用 **nonce/hash**，禁用通配 `unsafe-inline`；脚本/样式源走白名单  
- 认证与会话：同站点 `SameSite=Lax/Strict`，`HttpOnly` + `Secure`，CSRF 防护  
- 输入与输出：默认转义；后端 API 做输入验证；前端谨慎渲染 `dangerouslySetInnerHTML`
- 参考基线：**OWASP Top 10** 与 **OWASP ASVS（一般建议 L2）**  
- 机密：仅通过环境变量注入，**严禁**将密钥/令牌写入仓库或前端可见代码

---

## 7) 日志与观测（Observability）
- 错误上报：{{Sentry/TrackJS}}（含 Source Map），P99/P95 指标监控
- Web 性能：开启 RUM（真实用户监控）并回传 CWV；构建时输出 Lighthouse 报告

---

## 8) 部署（Deploy）
- 环境：`dev` / `staging` / `prod`；默认使用 {{Vercel/Netlify/AWS}}  
- CDN：静态资源走 CDN，启用不可变缓存（`Cache-Control: immutable, max-age=31536000`）
- 回滚：使用上一个稳定构建的构件（不可重新编译）
- 发布门禁：
  1. 所有检查通过：lint、typecheck、unit、e2e、a11y、lighthouse
  2. 安全扫描通过：依赖漏洞（`pnpm audit` 或 {{OWASP Dependency-Check}}）
  3. 变更说明（CHANGELOG）与版本号（SemVer）更新

---

## 9) 环境变量（.env）
- 读取自 `process.env.{{VAR_NAME}}`；本地样例放 `.env.example`；**不得**将 `.env` 入库  
- 关键项：`NEXT_PUBLIC_*`（前端可见）、`SECRET_*`（仅服务端用）  
- 需要新变量时：更新 `.env.example` + `docs/config.md`

---

## 10) Claude 的工作方式（How Claude Should Help）
> Claude 读取当前目录及父目录的 CLAUDE.md；当你在消息里引用 `@文件或目录` 时，会自动把对应目录/父目录的 CLAUDE.md 加入上下文。  
> **默认开启 Plan 模式**：先产出计划与影响评估，经确认后再改代码。

- **允许的工具**（建议预先 Always allow）：
  - Edit（文件编辑）、Bash（只允许：`git`、`pnpm`、`node`、`ls`、`cat`、`grep`、`find`）
  - GitHub：`gh` CLI（创建 PR/查看 Issue/评论）
- **禁止的操作**：
  - 任意外网脚本执行、安装系统级依赖、修改 CI/CD 凭据或云账户配置
- **工作流**：
  1. **探索与计划**：阅读相关文件，生成“变更计划 + 风险 + 回滚方案”，等待我回复“OK 执行”
  2. **实现**：最小变更集；同步更新测试、文档、Storybook
  3. **验证**：运行脚本 `pnpm verify`；生成报告摘要
  4. **提交**：生成 Conventional Commit 信息并创建 PR，附变更说明与验证结果
- **常用 Slash 命令**（位于 `.claude/commands/`）：
  - `/perf-audit`：读取 Lighthouse 报告，提出 5 条按影响度排序的优化建议
  - `/a11y-fix`：扫描 `src/app/**` 的可访问性问题并开 PR 修复
  - `/seo-jsonld $ARGUMENTS`：为路由 {{/blog/[slug]}} 生成 JSON-LD（类型：$ARGUMENTS）

---

## 11) 目录级 CLAUDE.md（建议）
- `src/components/CLAUDE.md`：组件命名、Props 规范、无障碍清单、Storybook 要求
- `src/app/CLAUDE.md`：路由约定、数据获取策略（SSR/SSG/ISR）、中间件与缓存策略
- `scripts/CLAUDE.md`：脚本用途、输入输出、侧效应说明与安全边界

---

## 12) 质量门禁脚本（可被 Claude 调用）
- `pnpm verify`：`lint && typecheck && test && a11y && lighthouse`
- `pnpm security`：依赖扫描 + 许可证检查（阻断高危漏洞）
- `pnpm bundle-report`：导出并对比构建体积（阈值由 `perf-budget.json` 定义）

---

## 13) 变更与文档
- 任何规则更新需同步：`CLAUDE.md`、`docs/*` 与 `.claude/commands/*`
- PR 模板必须包含：影响范围/风险/回滚/测试证据/监控点变更

---

## 附录 A：示例 JSON-LD（Article）
<!-- 仅示例，按页面实际字段替换 -->
```html
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"Article",
  "headline":"{{title}}",
  "datePublished":"{{ISO}}",
  "dateModified":"{{ISO}}",
  "author":{"@type":"Person","name":"{{Author}}"},
  "mainEntityOfPage":{"@type":"WebPage","@id":"{{canonical}}"}
}
</script>

```


#### Example for Personal Website

[下载 CLAUDE.md](../assets/CLAUDE.md)


#### First Round Prompt to Plan

```markdown
你现在处于“项目规划（Planning）阶段启动器”角色。请读取仓库根目录的 CLAUDE.md 并严格遵循其中的约定（前后端分离；前端 Next.js + Tailwind + yarn；后端 FastAPI + uv；统一启动脚本、端口清理、默认首页=个人介绍、其它功能&页面风格需先确认，等）。

工作方式：
- 采用“先提问、再产出”的交互式节奏。每一轮只提 **≤6** 个高价值问题，便于我快速响应。
- 每一轮结束时，请输出：
  1) 《本轮要点小结》（简明 5 行内）
  2) 《开放问题与待确认清单》（清楚标出我需选择/填写的项）
  3) 《滚动 TODO/Backlog》（按优先级分组：Now / Next / Later；每个 TODO 含：目标、完成条件、负责人=我、估时、依赖）
- 在我明确“确认/OK”之前，不要改动代码或生成大批文件；仅在计划层面收敛需求、风险与范围。
- 若我的回答含糊，请提出具体澄清选项；若需要示例，请给出不超过 2 个简洁示例。
- 所有决定落到“可验证的完成标准（验收标准/Definition of Done）”。

初始假设（来自 CLAUDE.md，可被我覆盖）：
- 默认首页展示个人介绍（头像/姓名/身份/社交链接/技能关键词/近期项目）
- 前端端口 3000，后端端口 8000（启动脚本会先清理端口占用）
- 其它功能与页面风格均需先征询我再进入开发

第 1 轮问题（请按如下顺序逐一提问，并在我回答后再继续）：
1) 站点定位与目标（单选/多选）：
   - ☐ 「名片型主页」(极简个人介绍 + 社交链接)
   - ☐ 「作品集/项目集」(项目卡片、详情页、筛选)
   - ☐ 「博客/日志」(MD 内容、标签、搜索、RSS)
   - ☐ 「联系/表单」(后端收件或第三方)
   - ☐ 其它：________
2) 目标受众与关键信息层级（例如：招聘方/合作伙伴/读者；首屏要突出什么？）
3) 页面风格（先给我 1~2 个方向，之后我再细化）：
   - ☐ 极简 / ☐ 杂志排版 / ☐ 霓虹赛博 / ☐ 新拟物 / ☐ 暗色优先 / ☐ 亮色优先 / ☐ 其它：________
4) 首批页面范围（从小做起，MVP 只选 2~3 个页面）：
   - 建议候选：Home(个人介绍) / Projects / Blog / About / Contact
5) 数据来源与内容形态：
   - ☐ 纯静态（仓库内 MD/JSON）  ☐ 后端 API（FastAPI 提供 /profile、/projects 等）
   - 初始内容我是否先用占位示例？（是/否）
6) 任何非功能性约束（SEO、加载速度、A11y、部署平台、域名/证书、Analytics、Sentry 等）中，有哪些是第 1 迭代必须要的？

（等我回答后继续第 2 轮）

第 2 轮问题（基于我的回答细化 MVP）：
1) Home 版式与信息块：头像/标题/一句话介绍/社交按钮/技能关键词/2~3 个“主力项目”入口 —— 哪些必留？有无参考站点？
2) 视觉元素：主色（十六进制或描述）、字体偏好（系统字体/衬线/无衬线）、是否需要暗色模式切换？
3) Projects/Blog（如选）：每个条目最少包含哪些字段？是否需要标签/搜索/分页？（若是 Blog，是否需要 RSS）
4) Contact（如选）：表单字段（姓名/邮箱/消息），提交通道（后端 API vs 外部服务），是否需要基础防刷（节流/验证码）
5) 后端 API MVP：优先支持哪些路由？（建议：/healthz、/profile、/projects、/contact）
6) 发布与环境：本地开发 OK 后，第 1 次部署目标（例如 Vercel + 后端 Railway/自托管），是否需要自定义域名与 HTTPS？

（等我回答后进入第 3 轮）

第 3 轮输出（不再提问，先给出“第一版可执行计划草案”供我确认）：
- 《信息架构(IA) v0》：站点导航与页面关系（简图）
- 《UI 草图要点》：每个页面 3~5 条关键组件/版式要点（文字描述即可）
- 《API v0》：MVP 路由与字段表（请求/响应示例）
- 《任务拆解与里程碑》：
  - Milestone 0：初始化工程（Next.js + Tailwind + yarn；FastAPI + uv；统一启动脚本验收；CORS 配置）
  - Milestone 1：Home MVP（个人介绍首屏 + 社交链接 + 占位数据/或接 API）
  - Milestone 2：第二页面（如 Projects 或 Blog 的最小列表）
  - Milestone 3：可选的 Contact 表单（含后端处理与基础防护）
- 《风险与待澄清》：列出前 5 项风险/不确定项与缓解措施
- 《验收标准(DoD)》：对每个里程碑给可验证条件（页面可视结果/接口可调用/脚本运行通过/无可访问性阻断等）

生成规范与格式：
- TODO/Backlog 使用三栏表：Now / Next / Later；每项写明【描述 | 完成条件 | 估时 | 依赖 | 验收方式】
- API 列表使用表格 + 简短 JSON 示例
- 避免一次给出大段代码，除非我明确“OK 进入实现”
- 若我回复“确认/OK”，再基于计划生成脚手架与文件改动清单（尊重 CLAUDE.md 的技术与目录约束）

开始第 1 轮提问吧。
```

#### Answer Qustions

![回答第一轮提问](../assets/lab-2-5.png)

![回答第二轮提问](../assets/lab-2-6.png)

![回答第二轮提问](../assets/lab-2-7.png)

#### Confirm & Generate Implementation Plan

![生成执行计划](../assets/lab-2-8.png)

![生成执行计划](../assets/lab-2-9.png)

![生成执行计划](../assets/lab-2-10.png)

#### Use Auto Mode - Dangerous

![按照计划完成开发](../assets/lab-2-11.png)

![按照计划完成开发](../assets/lab-2-12.png)

![按照计划完成开发](../assets/lab-2-13.png)

![按照计划完成开发](../assets/lab-2-14.png)

![按照计划完成开发](../assets/lab-2-15.png)

![按照计划完成开发](../assets/lab-2-16.png)

![按照计划完成开发](../assets/lab-2-17.png)

![按照计划完成开发](../assets/lab-2-18.png)

![按照计划完成开发](../assets/lab-2-19.png)

![按照计划完成开发](../assets/lab-2-20.png)

#### Verify the Final Result

![开发完成检验结果](../assets/lab-2-22.png)

![开发完成检验结果](../assets/lab-2-23.png)

![开发完成检验结果](../assets/lab-2-24.png)

![开发完成检验结果](../assets/lab-2-25.png)

![开发完成检验结果](../assets/lab-2-26.png)

![开发完成检验结果](../assets/lab-2-27.png)

![开发完成检验结果](../assets/lab-2-28.png)
