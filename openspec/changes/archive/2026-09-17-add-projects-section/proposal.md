## Why

Hero CTA "查看项目" 自 `add-hero-section` 归档起就跳转到 `#projects`，但 `#projects` 锚点对应的 Projects 区块尚未交付——点击后浏览器地址栏更新但页面无目标（design Open Questions 已记录为已知遗留）。本变更交付 Projects 区块本身，**闭环**该 CTA 行为，并让访客在首屏之后能继续浏览项目集合，形成完整的"身份 → 作品"叙事。

## What Changes

- 新增 `projects-section` capability：在首页 Hero 之后渲染一个项目集合区块，区块根元素带 `id="projects"`（闭合 CTA 跳转目标）。
- 提供项目列表展示：以卡片网格形式（移动端 1 列 / 桌面端 2 列）展示，每张卡片含标题、简介、标签列表、外部链接占位。
- 点击单张卡片：本期固定为"在新标签页打开外部链接（`href`）"；卡片整体作为 `<a>`，鼠标 hover 与 focus-visible 焦点环符合主题 token。
- 文案与配置集中在 `src/data/projects.ts`（数组形式），Hero 中已建立的 `profile.ts` 单文案源模式复用至此。
- 复用 Hero 已交付的主题基础设施：`useTheme`、`ThemeToggle`、`@theme` token、`<html class="dark">` 切换均不动；ProjectCard 通过现有 token 适配主题。
- 修改 `hero-section` spec 的"点击 CTA" Scenario：移除"若该锚点暂不存在"的兜底语，改为"页面跳转至 `#projects` 锚点并显示 Projects 区块"。
- 修改 `App.tsx`：在 `<Hero />` 之后渲染 `<Projects />`（不替换 Hero）；`App.css` 仍保持不存在。

## Capabilities

### New Capabilities

- `projects-section`：覆盖首页 Projects 区块的项目列表展示、卡片交互、主题适配与可访问性，定义用户/访客可观察的行为合约。

### Modified Capabilities

- `hero-section`：Scenario "点击 CTA" 的 THEN 描述中"若该锚点暂不存在，浏览器地址栏 `#projects` 已更新，无报错"部分需要更新——本变更引入 Projects 区块后，该兜底分支不再可达。

## Impact

- **源码改动**
  - `src/App.tsx`：在 `<Hero />` 后追加 `<Projects />`，单一根组件。
  - `src/components/Projects.tsx`：新增，列表容器 + `id="projects"`。
  - `src/components/ProjectCard.tsx`：新增，单卡片 `<a>` 元素 + 标题/简介/标签。
  - `src/data/projects.ts`：新增，导出 `projects` 数组（含 title / description / tags / href / external 字段，占位数据齐全）。
- **API / 后端**：无。
- **依赖**：不新增 npm 包；沿用 React 19 + Vite + Tailwind v4 + 既有 `useTheme`。
- **性能影响**
  - Projects 区块在 Hero 之后（非首屏），不参与"首屏 < 2s"预算；但项目列表仍应 lazy-friendly：本期数据为常量数组，无网络请求，渲染成本极低。
  - 若未来加入缩略图，需使用 `loading="lazy"`（与 config.yaml "所有图片使用 lazy loading" 一致），本期无图片不受影响。
- **对现有功能的影响**
  - **CTA 行为语义升级**：原 spec 中"页面跳转至 `#projects` 锚点（若该锚点暂不存在，浏览器地址栏 `#projects` 已更新，无报错）" 改为"页面跳转至 `#projects` 锚点并显示 Projects 区块"。这是 spec 级改动，会同步到 `openspec/specs/hero-section/spec.md`。
  - **Hero 组件、ThemeToggle、useTheme、index.css、index.html 均不动**——本变更纯增量。
  - **滚动锚点**：浏览器原生 `<a href="#projects">` 会平滑滚动到 `id="projects"`，需确认 `Projects` 组件根元素 `id` 与 Hero CTA `href` 完全一致（`#projects`，连字符小写复数）。
- **部署**：本次变更不修改 Vite `base` 配置；产物路径仍为 `/my-website/`。
