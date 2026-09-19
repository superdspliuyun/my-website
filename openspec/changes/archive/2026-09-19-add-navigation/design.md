# Design

## Context

当前 `App` 仅渲染 `Hero`，Hero CTA 已指向 `#projects`，但项目与联系区域尚不存在。实现需延续 React 函数组件、Tailwind CSS v4、现有主题切换和粒子背景，不引入额外依赖。

## Goals / Non-Goals

**Goals:**

- 建立可复用的 `Navigation` 组件，并在页面根部统一组合 `Hero`、项目占位和联系占位 Section。
- 使用原生锚点与 CSS `scroll-behavior` 实现平滑滚动，通过 `scroll-margin` 解决固定导航遮挡。
- 使用 Tailwind 的半透明背景、`backdrop-blur` 和主题变体实现科技感导航层，并保留不支持 blur 时的背景后备。
- 保持键盘可访问性、焦点可见性和窄屏布局。

**Non-Goals:**

- 不实现搜索、多级菜单、登录注册、后端 API、真实项目数据或联系表单提交。
- 不添加新的动画系统；平滑滚动仅作为导航行为，粒子缓慢运动仍由既有 Hero 能力负责。

## Decisions

### 使用原生锚点而非客户端路由

导航链接采用 `href="#hero"`、`href="#projects"`、`href="#contact"`。单页锚点无需新依赖，直接兼容 GitHub Pages base path；备选的 React Router 会增加依赖和部署路由复杂度，收益不足。

### 使用 CSS 平滑滚动与目标偏移

在全局样式设置 `scroll-behavior: smooth`，Section 设置 `scroll-mt` 或等效 Tailwind 类以避开固定导航。对 `prefers-reduced-motion` 提供 `scroll-behavior: auto` 后备，避免强制运动；备选的 JavaScript scroll handler 会增加状态和边界处理。

### 导航作为独立函数组件

将链接配置集中在 `Navigation.tsx`，通过语义化 `nav`、列表和链接保证可读性；Section 以独立 PascalCase 组件承载最小占位内容，避免把页面结构堆在 `App.tsx`。不使用 inline style。

### 主题与模糊视觉复用现有机制

导航直接使用现有 `.dark` 根类和 Tailwind `dark:` 变体，不另建主题状态。`backdrop-blur` 仅负责增强视觉，配合半透明/不透明背景后备确保旧浏览器可用。

## Risks / Trade-offs

- [固定导航遮挡标题] → 为所有导航目标 Section 设置滚动偏移，并用键盘与窄屏手动检查。
- [低端设备 blur 性能开销] → 使用轻量 Tailwind blur 与半透明层，不添加额外脚本或持续动画。
- [用户偏好减少运动] → 全局平滑滚动在 reduced-motion 下关闭；现有粒子组件继续遵循该偏好。
- [占位 Section 被误认为真实内容] → 使用明确的占位文案，不提供数据、表单或 API 行为。

## Migration Plan

1. 新增导航和两个占位 Section，更新 `App` 页面组合与全局滚动样式。
2. 运行 `npm run lint`、`npm run build`，并在开发服务器中验证三个锚点、主题切换、键盘焦点和窄屏布局。
3. 若出现问题，可移除新增组件并恢复 `App` 仅渲染 `Hero`；无需数据迁移或部署配置变更。
