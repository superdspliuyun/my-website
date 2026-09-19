# Design

## Context

现有首页只包含静态占位内容，已具备 React、TypeScript 和 Tailwind CSS v4 基础配置。详见 `proposal.md`，本设计聚焦首屏实现、主题状态和背景性能。

## Goals / Non-Goals

**Goals:**

- 将首页替换为一个可独立维护的 Hero Section，并以浏览器原生 Canvas 提供低干扰粒子层。
- 在不增加运行时依赖的前提下，实现亮色/暗色主题切换、持久化和系统偏好回退。
- 让内容、CTA 和主题控件在窄屏、键盘操作、减少动态效果及 Canvas 不可用时仍可使用。

**Non-Goals:**

- 不添加内容入场、CTA hover、平滑滚动或页面滚动动画。
- 不创建项目列表、导航栏、路由或后端接口。
- 不用第三方粒子库替代浏览器原生 Canvas。

## Decisions

### 将结构拆分为 Hero、ThemeToggle 和 ParticleCanvas 组件

Hero 负责语义化内容和布局，ThemeToggle 只处理用户主题操作，ParticleCanvas 只负责背景绘制。组件采用 TypeScript 函数式组件和 PascalCase 文件名，样式以 Tailwind utilities 表达。

备选方案是在 `App.tsx` 中实现全部逻辑。该方案初期文件更少，但会混合内容、主题与 Canvas 生命周期，后续维护和测试成本更高。

### 使用 HTML class 驱动的主题，而非只依赖系统 media query

通过 Tailwind CSS v4 的 custom dark variant 将 `dark:` utilities 绑定到根元素的 `dark` class。初始化时先读取 `localStorage`，不存在时读取 `prefers-color-scheme`；切换时更新根元素和本地存储。

备选方案是仅使用 `prefers-color-scheme`。该方案无法满足用户手动切换和持久化要求。

### 使用 CSS 渐变作为基础，Canvas 作为渐进增强粒子层

渐变、光晕和内容对比度由 CSS 负责，即使 Canvas 不可用也能保留完整视觉层次。ParticleCanvas 以绝对定位的非交互层叠加；其绘制尺寸随容器更新，设备像素比设上限，并随视口尺寸降低粒子数量。

备选方案是用纯 CSS 动画生成粒子，或引入粒子库。前者难以控制连线和响应式密度，后者增加依赖与首屏负担。

### 将 Canvas 动画限制在粒子层

粒子使用低速 `requestAnimationFrame` 循环；系统启用 `prefers-reduced-motion`、页面不可见或组件卸载时停止循环。Hero 内容、CTA、主题切换和页面滚动不使用动画。

备选方案是完全静态背景。该方案更简单，但不满足已确认的缓慢动态粒子需求。

## Risks / Trade-offs

- [Canvas 在高 DPI 或大屏设备绘制成本过高] → 限制 device pixel ratio、粒子数量和帧循环；页面隐藏时暂停。
- [动态背景降低文本可读性] → 内容层保持更高 z-index，使用主题化遮罩和足够对比度。
- [主题在首次渲染后发生闪烁] → 在 React 挂载时尽早同步根元素主题；后续可在 HTML 中加入更早的初始化脚本，但不属于本次必要范围。
- [`#projects` 尚无实际内容] → CTA 仅使用预留锚点；本次不创建项目列表。

## Migration Plan

1. 以新的 Hero 组件替换当前首页占位内容。
2. 本地执行 `npm run build` 和 `npm run lint`，在亮色、暗色、窄屏与 reduced-motion 条件下验证。
3. 部署前使用 GitHub Pages 的 `/my-website/` base path 验证静态资源与锚点链接。
4. 若 Canvas 导致性能或兼容性问题，保留 CSS 渐变并禁用粒子层即可回退，不影响核心内容和主题切换。
