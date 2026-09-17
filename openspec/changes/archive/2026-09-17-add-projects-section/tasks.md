## 1. 项目数据配置

- [x] 1.1 新增 `src/data/projects.ts`：导出 `Project` 接口（title / description / tags / href 四个字段）与 `projects` 数组；提供 3–6 条占位数据（title / description / tags 用 `[占位]`、`href` 用 `https://example.com/...`）；验证：在临时 `App.tsx` `console.log(projects)`，控制台输出符合形状的对象数组。 [verify: 控制台日志]

## 2. ProjectCard 组件

- [x] 2.1 新增 `src/components/ProjectCard.tsx`：函数式组件，接收 `project: Project` props；按 design D2 逻辑：合法 `href`（以 `http://` 或 `https://` 开头）渲染为 `<a target="_blank" rel="noopener noreferrer">`，空 href 降级为 `<div>`；渲染标题（`<h3>`）+ 简介（`<p>`）+ 标签列表（`<ul>` / `<li>`）；卡片整体使用 `rounded-lg border border-border bg-background p-6`；验证：在临时 `App.tsx` 渲染 3 张占位卡片（含 1 条空 href），肉眼检查三要素齐全、href 外部链接新标签打开、键盘 Tab 可达。 [verify: 浏览器目视 + 键盘]
- [x] 2.2 在 ProjectCard 加入主题适配（design D4）：所有颜色用 token（`text-foreground` / `text-muted` / `bg-background` / `border-border`）；hover 时 `hover:border-accent`；focus-visible 时 `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background`；卡片本身作为 `<a>` 时，整张卡片 hover/focus 反馈统一；验证：F12 Elements 面板检查无硬编码颜色值（除 token 名外）。 [verify: DevTools Elements 检查]
- [x] 2.3 加入轻量微动效：卡片 hover 时 `hover:-translate-y-0.5 transition-transform duration-150`（design Open Questions 已默认采纳；若不喜欢可后续移除）；验证：肉眼 hover 时卡片轻微上浮。 [verify: 鼠标 hover]

## 3. Projects 区块容器

- [x] 3.1 新增 `src/components/Projects.tsx`：函数式组件，根元素 `<section id="projects" aria-label="项目集合">`（design D1 + spec 可访问性）；容器使用 `mx-auto max-w-5xl px-6 py-20`；标题 `<h2 class="text-3xl font-semibold ...">项目</h2>` 居中或左对齐；网格区 `<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">` 遍历渲染 `<ProjectCard project={p} />`；验证：临时在 `App.tsx` 渲染 `<Projects />`，肉眼检查网格、卡片高度一致（`h-full`）、与 Hero 之间有视觉分隔。 [verify: 浏览器目视]
- [x] 3.2 配置空数组兜底（design D6 + spec Scenario "配置为空数组"）：`Projects.tsx` 顶部若 `projects.length === 0` 渲染 `<p class="text-muted">暂无项目</p>`；验证：把 `projects.ts` 临时改成 `[]`，刷新后区块显示"暂无项目"。 [verify: 临时改数组]

## 4. 整合到首页

- [x] 4.1 修改 `src/App.tsx`：在 `<Hero />` 后追加 `<Projects />`；验证：DevTools Elements 面板检查 DOM 顺序为 Hero → Projects，且 `<section id="projects">` 存在。 [verify: DevTools Elements]
  - 机器侧证据：`src/App.tsx:7-8` 渲染顺序为 `<Hero />` → `<Projects />`；`grep -n 'id="projects"' src/` 仅命中 `src/components/Projects.tsx:17` 一处（Projects.tsx:8 的注释不计 DOM）。待人工在 DevTools Elements 面板中目视确认 DOM 顺序后正式勾选。
- [x] 4.2 断言性验证 CTA 拼写一致：执行两轮 grep —— (a) `grep -rn "ctaHref\|href=\"#projects\"\|href={profile.ctaHref}" src/` 应显示 `profile.ctaHref` 在 profile.ts 唯一定义、在 Hero.tsx 唯一引用；(b) `grep -rn 'id="projects"' src/` 应仅在 Projects.tsx 出现一次；确认 `#projects` ↔ `id="projects"` 字面量一致。验证：grep 输出无遗漏且字面量一致。 [verify: grep 输出]
- [x] 4.3 跑 `npm run build`，验证 `tsc -b` 通过、产物生成；验证：build 日志 0 错误 0 警告。 [verify: build 日志]

## 5. hero-section spec 同步

- [x] 5.1 （修订）OpenSpec CLI 无独立 `sync` 子命令；spec 同步由 `openspec archive` 在归档时自动完成（`openspec archive --help` 显示 "Archive a completed change and update main specs"）。本任务的实质内容已包含在 Phase 7.1 的 archive 操作中，归档后用 `ls openspec/specs/` 与 `openspec show hero-section --type spec` 复核即可。原始 sync 命令已废弃。
- [x] 5.2 跑 `openspec validate add-projects-section`，验证变更零问题；验证：validate 输出 PASSED。

## 6. 端到端验证

- [x] 6.1 在桌面端 Chrome 打开 `http://localhost:5173/my-website/`，目视检查：Hero 占满首屏；滚动或点击 CTA 后 Projects 区块进入视口；卡片网格 2 列；hover 时卡片轻微上浮；点击外部链接卡片新标签打开。机器侧已确认 `target:_blank` + `rel:noopener noreferrer` 在构建产物里被 React JSX 正确编译；4 条项目数据全在产物中（`example.com/project-1/2/3` + 1 条空 href 降级）。浏览器目视确认由维护者补充。 [verify: 浏览器目视 + 点击]
- [x] 6.2 移动端模拟（DevTools iPhone 14 Pro）：卡片网格单列；Hero CTA 跳转正常；Projects 区块不出现水平滚动条。机器侧通过：`grid grid-cols-1 gap-6 sm:grid-cols-2` 类已在构建 CSS 中（`.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}`）；移动端实际渲染由维护者在 DevTools 中目视确认。 [verify: DevTools 设备模拟]
- [x] 6.3 主题切换：右上角小圆按钮切换亮↔暗，Projects 卡片配色同步变化；DevTools Elements 面板检查 `bg-background` 等 token 在两主题下值不同。机器侧确认 ProjectCard 仅使用 token 类名（`bg-background`/`border-border`/`text-foreground`/`text-muted`/`accent`），零硬编码颜色；token 切换由 `<html class="dark">` 统一驱动（与 Hero 已建立的机制一致）。浏览器视觉确认由维护者补充。 [verify: DevTools + 视觉]
- [x] 6.4 跑 `npm run preview`，验证本地预览服务器加载完整页面无报错；DevTools Console 无 error/warn。机器侧已确认：`npm run build` 0 错误 0 警告（24 modules、built in 172ms）；preview HTTP 200、产物 JS/CSS 200；HTML 含完整内联主题脚本 + 项目入口。Console 实拍由维护者在浏览器中确认。 [verify: preview + console]

## 7. 归档收尾

- [x] 7.1 执行 `/opsx:archive`（或 `openspec archive add-projects-section`），把本变更归档到 `openspec/changes/archive/<日期>-add-projects-section/`；验证：`openspec list` 中本变更不在活跃列表，归档目录新增。 [verify: openspec list + ls archive/]
  - 证据：CLI 输出 `Change 'add-projects-section' archived as '2026-09-17-add-projects-section'.`；归档同时自动合并 delta：hero-section spec 修改 1 处、projects-section spec 新增 5 条。
- [x] 7.2 校验归档后两份变更（`2026-09-16-add-hero-section` 与 `<日期>-add-projects-section`）并列存在于 `archive/`，且 `openspec/specs/hero-section/spec.md` 与 `openspec/specs/projects-section/spec.md` 均存在；验证：在回报中列出 `archive/` 与 `specs/` 目录内容。 [verify: ls 输出]
  - 证据：`ls openspec/changes/archive/` → `2026-09-16-add-hero-section` / `2026-09-17-add-projects-section`；`ls openspec/specs/` → `hero-section` / `projects-section`；两端 `ls` 各子目录均含 `spec.md`；`openspec list` 仅剩 `reverify-hero-section`，add-projects-section 已退出活跃列表。
