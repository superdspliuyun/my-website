# Proposal

## Why

当前项目区域只有“内容正在准备中”的占位文案，无法展示个人实际作品或帮助访客了解项目能力。现在将其升级为可替换数据驱动的项目卡片区，可在不引入后端的情况下形成清晰的作品入口。

## What Changes

- 将 Hero 下方的项目占位 Section 替换为至少 4 个项目卡片组成的展示区。
- 每张卡片展示项目截图、项目名称、项目简介和 Github 链接，并使用可替换的示例项目数据。
- 使用响应式卡片布局，兼容亮色/暗色主题，并在鼠标悬浮时提供轻量视觉特效。
- 将 Hero CTA 保持指向项目展示区的 `#projects` 锚点，并确保点击后到达新的项目内容。
- 对项目截图使用适合非首屏资源的 lazy loading，不改变 GitHub Pages `/my-website/` base path。

### Out of scope

- 不做项目详情页或项目详情路由。
- 不做项目搜索、筛选或排序功能。
- 不新增后端 API、CMS、项目数据管理后台或用户登录注册。

## Capabilities

### New Capabilities

- `project-section`: 提供至少四个包含截图、名称、简介和 Github 链接的响应式项目卡片，以及悬浮微特效。

### Modified Capabilities

- `hero-section`: 将 Hero CTA 的目标明确关联到可见的项目展示 Section，并保持键盘激活行为可用。

## Impact

- 影响 `src/components/ProjectsSection.tsx`、可能新增项目卡片组件或数据模块，以及 `src/components/Hero.tsx` 的 CTA 关联验证。
- 需要新增或复用项目截图资源；示例图片应作为可替换静态资源并使用 lazy loading，不影响首屏加载目标。
- 继续使用现有 React、TypeScript 和 Tailwind CSS v4，不引入新的 runtime dependency。
- 卡片悬浮效果仅限轻量 CSS transform/shadow，不改变现有导航、主题切换、粒子背景和联系我 Section 行为。
