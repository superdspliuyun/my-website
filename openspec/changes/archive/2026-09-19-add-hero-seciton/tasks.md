# Tasks

## 1. Theme foundation

**验收条件：** 亮色/暗色主题可通过键盘操作切换并在刷新后恢复；无已保存偏好时跟随系统主题。

- [x] 1.1 在 Tailwind CSS v4 中配置由根元素 `dark` class 驱动的 `dark:` variant，并验证亮色和暗色 utility 均生效
- [x] 1.2 创建 `ThemeToggle` 函数式组件，实现 localStorage 持久化与 `prefers-color-scheme` 回退，并验证切换、刷新恢复和键盘激活
- [x] 1.3 在 Phase 1 完成后运行 `npm run build` 与 `npm run lint`，记录结果并停止等待用户确认

## 2. Hero content and layout

**验收条件：** 首屏在桌面和窄屏下完整居中显示指定身份文案、CTA 和主题控件，且无水平滚动。

- [x] 2.1 创建 PascalCase 的 `Hero` 函数式组件，展示“小飞侠”“天马行空”和指定介绍文案，并验证首屏内容可见
- [x] 2.2 使用 Tailwind CSS 实现全屏高度、响应式居中布局、亮暗主题配色及 CTA 的 `#projects` 目标，并验证窄屏和键盘 CTA 行为
- [x] 2.3 在 Phase 2 完成后运行 `npm run build` 与 `npm run lint`，检查桌面和窄屏渲染并停止等待用户确认

## 3. Particle background and integration

**验收条件：** CSS 渐变和缓慢 Canvas 粒子仅作为背景层运行，主题切换时配色同步，并在 reduced-motion 或 Canvas 不可用时不影响核心内容。

- [x] 3.1 创建 PascalCase 的 `ParticleCanvas` 函数式组件，实现响应式 Canvas 尺寸、受限 device pixel ratio 和随视口缩放的粒子数量，并验证背景不阻塞交互
- [x] 3.2 实现缓慢粒子循环及主题配色同步，在 reduced-motion、页面隐藏和组件卸载时停止绘制，并验证内容、CTA 和主题控件没有动画
- [x] 3.3 将 Hero、ThemeToggle 和 ParticleCanvas 集成到首页，保留 `#projects` 预留锚点且不实现项目列表，并验证 Canvas 不可用时核心内容仍可用
- [x] 3.4 在 Phase 3 完成后运行 `npm run build` 与 `npm run lint`，手动验证亮暗主题、reduced-motion、窄屏和 CTA，并停止等待用户确认
