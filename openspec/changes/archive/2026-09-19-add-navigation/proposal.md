# Proposal

## Why

当前页面只有 Hero 首屏，缺少稳定的页面入口，用户无法快速访问项目和联系方式。现在补充统一的顶部导航与目标 Section，可建立清晰的信息架构，并为后续内容扩展提供可用锚点。

## What Changes

- 新增固定在页面顶部的导航栏，左侧展示“小飞侠”，右侧提供“首页”“项目”“联系我”链接。
- 导航链接使用页面锚点平滑滚动到 `#hero`、`#projects`、`#contact`。
- 导航栏在页面滚动或覆盖内容时使用背景模糊与半透明背景，兼容亮色和暗色主题。
- 新增最小的项目占位 Section 与联系我占位 Section，保证导航目标真实存在并具备可访问标题。
- 评估并保持现有 Hero CTA、主题切换、粒子背景和 GitHub Pages base path 的行为不变。

### Out of scope

- 不做搜索功能。
- 不做多级下拉菜单。
- 不做用户登录和注册。
- 不新增后端 API、项目数据管理或真实联系表单提交能力。

## Capabilities

### New Capabilities

- `navigation`: 提供固定顶部导航、锚点平滑滚动、背景模糊和项目/联系我目标 Section。

### Modified Capabilities

- `hero-section`: 补充 Hero 与全局导航、项目 Section 之间的页面结构衔接，并确保原有 CTA 目标继续有效。

## Impact

- 影响 `src/App.tsx`、`src/components/` 下的导航组件及新增 Section 组件，并可能调整全局 `src/index.css` 的滚动行为。
- 不引入新的 runtime dependency；继续使用现有 React、TypeScript 与 Tailwind CSS v4。
- 固定导航会减少页面顶部可视空间，需要通过锚点滚动偏移和响应式布局避免遮挡 Section 标题。
- 静态 Section 与 CSS 模糊效果不改变 GitHub Pages 部署方式或 `/my-website/` base path；无图片资源变更。
