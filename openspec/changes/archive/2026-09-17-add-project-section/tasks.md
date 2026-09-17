## 1. 数据接口扩展（Project）

- [ ] 1.1 在 `src/data/projects.ts` 的 `Project` 接口中追加两个可选字段：`screenshot?: string` 与 `githubUrl?: string`（design D7）；JSDoc 注释同步说明字段用途与占位约定。验证：`npx tsc -b` 0 错误，新字段被 `readonly Project[]` 类型吸收。 [verify: tsc -b]
- [ ] 1.2 在 `src/data/projects.ts` 的 4 条数据中各增 `screenshot` 与 `githubUrl` 字段值（design D3 + D7）：screenshot 用 `/projects/placeholder-N.svg` 形式占位（4 个 N=1..4），githubUrl 用 `https://github.com/[username]/[repo]` 形式占位。验证：`grep -n 'screenshot\|githubUrl' src/data/projects.ts` 命中 4 条数据每条 2 处。 [verify: grep 输出]

## 2. 截图占位 SVG 文件

- [ ] 2.1 新增 `public/projects/placeholder-1.svg` ~ `placeholder-4.svg` 共 4 个文件（design D3）：每张 16:9 viewBox（`viewBox="0 0 1600 900"`），背景用 token `var(--color-border)`，居中文字 `[项目截图占位 N]`，主题感知（不写死颜色值，使用 CSS 变量或两套 token）。验证：`npm run dev` 访问 `http://localhost:5173/my-website/projects/placeholder-1.svg` 返回 200 + SVG 内容。 [verify: curl + 文件大小]

## 3. ProjectCard 组件改造

- [ ] 3.1 在 `src/components/ProjectCard.tsx` 顶部增 `hasScreenshot` 与 `hasGithubUrl` 两个判断变量（design D6），后者额外含 `/^https?:\/\//.test(...)` 校验。验证：`grep -n 'hasScreenshot\|hasGithubUrl' src/components/ProjectCard.tsx` 命中两处判断定义。 [verify: grep]
- [ ] 3.2 在 ProjectCard 渲染分支的 `content` 内、`<h3>` 标题之前增 screenshot 渲染分支（design D1）：`<img>` 含 `loading="lazy" decoding="async" alt="..." className="mb-4 aspect-video w-full rounded-md border border-border object-cover"`，`alt` 缺失 title 时降级 `"项目截图"`；hasScreenshot === false 时不渲染 `<img>`，不渲染占位 div（避免留白）。验证：临时把 `projects[0].screenshot` 改 `''`，刷新后卡片顶部不渲染 `<img>`，直接从标题开始；恢复后 `<img>` 回归。 [verify: 临时改 profile + 浏览器]
- [ ] 3.3 在 ProjectCard 渲染分支的 `content` 内、`<ul>` 标签列表之后增 GitHub 链接渲染分支（design D4 + D5）：内联 SVG GitHub 图标（24×24 viewBox）+ 文本"在 GitHub 上查看"；`<a>` 含 `target="_blank" rel="noopener noreferrer" aria-label={hasTitle ? \`在 GitHub 上查看 ${title}\` : '在 GitHub 上查看此项目'} className="... focus-visible:ring-2 ..."`；hasGithubUrl === false 时不渲染；**aria-label 必须在 title 缺失时降级为"在 GitHub 上查看此项目"**（spec「GitHub 链接 a11y」Scenario 硬性要求）。验证：临时把 `projects[0].githubUrl` 改 `''`，刷新后卡片底部不渲染 GitHub 链接；恢复后回归；再把 `projects[0].title` 临时改 `''`，验证 aria-label 降级。 [verify: 临时改 + 浏览器 + DevTools Elements]
- [ ] 3.4 按 design D2 改造 ProjectCard 根元素：将 `<a>` / `<div>` 顶层元素的整体可点击行为去掉（保留 href / title 字段读取），改为始终用 `<div>` 包裹整个卡片；新增 `<a href={validHref}>` 文本"查看项目 →"链接放在卡片底部 GitHub 链接旁（仅在 hasContent(validHref) 时渲染），保证"卡片有可点击元素 + GitHub 独立入口并存"且 HTML5 合法（`<a>` 不嵌套 `<a>`）。验证：DevTools Elements 检查根元素为 `<div>`，内部出现两个独立 `<a>`（"查看项目"与"在 GitHub 上查看"）；点击卡片后部分卡片的整体点击失效，仅文本链接可点。 [verify: DevTools Elements + 浏览器点击]
- [ ] 3.5 主题适配（design D8）：截图边框 `border-border`、GitHub 链接 `text-foreground hover:text-accent` 与 focus-visible；颜色全部 token，零硬编码。验证：`grep -nE '#[0-9a-fA-F]{3,6}|rgb' src/components/ProjectCard.tsx` 0 命中（无硬编码颜色）；F12 Elements 检查 className 仅 token / 工具类。 [verify: grep + DevTools]

## 4. 验证 Projects 区块渲染顺序

- [ ] 4.1 验证 Projects 区块结构未变（design D8）：`src/components/Projects.tsx` / `src/App.tsx` / `src/components/Hero.tsx` / `src/components/Navigation.tsx` / `src/components/Contact.tsx` / `src/components/ThemeToggle.tsx` / `src/index.css` 全部未被修改；Hero CTA `href="#projects"` 仍指向 Projects 区块。验证：`grep -L .`（grep 全部文件 modified list） 或 `git diff --stat` 仅显示 `ProjectCard.tsx` / `projects.ts` / `public/projects/*.svg` 三类文件被改。 [verify: diff / grep]
- [ ] 4.2 跑 `npx tsc -b` 校验类型，0 错误。验证：tsc 输出无 error。 [verify: tsc -b]
- [ ] 4.3 跑 `npm run build` 校验产物，0 错误 0 警告；产物 JS 中 grep `screenshot` / `githubUrl` / GitHub SVG path / `placeholder-` 字面量确认字段已编入。验证：build 日志 + grep。 [verify: build + grep]

## 5. 端到端验证（桌面端）

- [ ] 5.1 桌面端 Chrome 打开 `http://localhost:5173/my-website/`，目视检查 Projects 区块：4 张卡片各显示 16:9 占位截图 + 标题 / 简介 / 标签 + GitHub 链接按钮 + "查看项目 →"链接。验证：肉眼。 [verify: 浏览器目视]
- [ ] 5.2 点击 GitHub 链接 MUST 在新标签页打开（占位 URL `https://github.com/[username]/[repo]` 跳转时浏览器显示 404 GitHub 页面即可，证明新标签打开 + URL 正确拼接）。验证：肉眼 + DevTools 检查 `<a target="_blank">`。 [verify: 浏览器点击]
- [ ] 5.3 点击 "查看项目 →" 链接 MUST 跳转至 href 目标（第 1-3 条 example.com 在新标签，第 4 条 href 空则不渲染）。验证：肉眼 + DevTools。 [verify: 浏览器点击]
- [ ] 5.4 截图加载策略：DevTools Network 面板观察，刷新页面后 Projects 区块的 4 张 `<img>` 在视口进入前不发起请求（lazy 生效）。验证：DevTools Network 面板录制。 [verify: DevTools Network]
- [ ] 5.5 主题切换：明亮 ↔ 暗黑，截图边框与 GitHub 链接颜色下一帧内到位、无闪烁；DevTools Console 无 error / warn。验证：DevTools + Console 面板。 [verify: DevTools + Console]
- [ ] 5.6 键盘 Tab 序列与焦点环（spec「GitHub 链接 a11y」硬性要求）：通过键盘 Tab 浏览 Projects 区块各卡片，验证：(a) Tab 序列含"查看项目 →"与"在 GitHub 上查看"两个独立 `<a>`，互不重叠焦点；(b) 每个 `<a>` 获焦时显示 `:focus-visible` 焦点环；(c) DevTools Accessibility 面板检查 `aria-label` 正确暴露。验证：键盘 Tab + DevTools Accessibility。 [verify: 键盘 Tab + Accessibility 面板]

## 6. 端到端验证（移动端）

- [ ] 6.1 iPhone 14 Pro 模拟：卡片单列、截图 16:9 占满宽度、GitHub 链接与 "查看项目 →" 在窄屏下不溢出 / 不重叠；触摸点击 GitHub 链接跳转。验证：DevTools 设备模拟。 [verify: DevTools 设备模拟]
- [ ] 6.2 打印预览：截图 MUST 正常打印（`loading="lazy"` 在 print 上下文通常仍加载），GitHub 链接 MUST 在打印中可见（不写 print:hidden，与 spec 一致）。验证：DevTools Rendering print emulation。 [verify: DevTools print emulation]

## 7. 字段缺失兜底与边界验证

- [ ] 7.1 把 `projects[0].screenshot` 临时改为 `''`，刷新后该卡片 MUST NOT 渲染 `<img>` 元素，卡片直接从标题开始不出现空白区。验证：临时改 + 浏览器。 [verify: 临时改]
- [ ] 7.2 把 `projects[0].githubUrl` 临时改为 `''`，刷新后该卡片 MUST NOT 渲染 GitHub 链接元素，"查看项目 →"仍渲染。验证：临时改 + 浏览器。 [verify: 临时改]
- [ ] 7.3 把 `projects[0].githubUrl` 临时改为 `'javascript:alert(1)'`，刷新后 MUST 不渲染为 `<a>`（XSS 防护）；卡片底部 GitHub 位置不出现可点击元素。验证：临时改 + 浏览器 + Console（不应有 alert 弹窗）。 [verify: 临时改 + Console]
- [ ] 7.4 跑 `npm run preview`，验证本地预览服务器加载完整页面无报错；DevTools Console 无 error/warn。验证：preview + console。 [verify: preview + console]
- [ ] 7.5 截图加载失败兜底（spec「截图加载失败」Scenario 硬性要求）：把 `projects[0].screenshot` 临时改为 `/projects/nonexistent-404.svg`（Vite 会返回 404），刷新后 MUST 不抛出未捕获异常；浏览器原生 broken image 占位 MUST 出现于该卡片顶部；其余 3 张卡片的标题 / 简介 / 标签 / GitHub 链接 MUST 正常渲染；Console 无未捕获异常。验证：临时改 + DevTools Console + Network 面板。 [verify: 临时改 + DevTools Network/Console]

## 8. 归档收尾

- [ ] 8.1 执行 `openspec validate add-project-section`，验证变更零问题。验证：validate 输出 PASSED。 [verify: validate 输出]
- [ ] 8.2 执行 `openspec archive add-project-section`，把本变更归档到 `openspec/changes/archive/<日期>-add-project-section/`；归档同时自动合并 delta 到 `openspec/specs/projects-section/spec.md`（新增 3 个 Requirements）。验证：`openspec list` 中本变更不在活跃列表；归档目录新增。 [verify: openspec list + ls archive/]
- [ ] 8.3 **D2 trade-off spec 落档**（design R5 Mitigation + 正确性验证 HIGH issue）：归档后**手工**在 `openspec/specs/projects-section/spec.md` 追加一条 ADDED Requirement 显式声明："卡片整体 MUST 渲染为 `<div>`（不再为 `<a>`），由底部"查看项目 →"文本链接承载跳转；该调整为 add-project-section 的 D2 决策结果"——避免 spec 字面（"卡片整体 MUST 作为可访问的链接元素"）与代码漂移。验证：`grep -n '卡片整体 MUST' openspec/specs/projects-section/spec.md` 命中两处（原 REQUIREMENT + 本次新增声明）；`grep -n '<div>' src/components/ProjectCard.tsx` 命中卡片根元素。 [verify: grep spec + grep code]
- [ ] 8.4 校验归档后 5 份变更（`add-hero-section` / `add-projects-section` / `reverify-hero-section` / `add-navigation` / `add-project-section`）并列存在于 `archive/`，且 main specs/`projects-section/spec.md` 含本次新增的 3 + 1 个 Requirements（ADDED 4 个）。验证：回报中列出 `archive/` + `specs/` 目录内容 + projects-section spec.md Requirement 数量。 [verify: ls + grep]