## Context

项目目前为 Vite + React 19 + TS + Tailwind v4 模板状态：`App.tsx` 是 Vite 自带 demo（react/vite logos + 计数器），`index.css` 用 CSS 变量 + `prefers-color-scheme` 维护一套与 Tailwind v4 重复的主题方案，`App.css` 含大量与 demo 强耦合的样式。`index.html` 为 `lang="en"`、默认 title。仓库目前没有任何业务功能模块，因此本变更承担双重身份：(1) 交付 Hero 区块本身，(2) 为后续所有区块建立"主题基础设施"（Tailwind v4 class-based dark + 持久化 + 无闪烁初始化）。

提案动机与范围见 `proposal.md`；行为合约见 `specs/hero-section/spec.md`。本文件只覆盖"如何实现"。

## Goals / Non-Goals

**Goals:**
- 提供 Hero 区块（姓名 / 职业 / 一句话 / CTA / 渐变 + 粒子背景 / 主题切换）。
- 建立可复用的"主题基础设施"：hook、初始化脚本、Toggle 组件，供后续变更直接复用。
- 在 Tailwind v4 中以 `@variant dark (class &)` 启用 class-based 暗色，配合 `<html class="dark">` 切换。
- 性能预算：首屏 < 2s；粒子为可选图层，不阻塞文本渲染。

**Non-Goals（设计层面，排除提案已声明的红线之外的额外设计取舍）:**
- 不引入任何动画库（framer-motion / react-spring 等）；入场/出场的微动效用 Tailwind transition + CSS 完成。
- 不引入粒子特效库（tsparticles / three.js）；Canvas 2D 手写约 100–150 行。
- 不引入图标库；ThemeToggle 使用内联 SVG（sun / moon）。
- 不建立路由系统；CTA 走锚点跳转。
- 不修改 Vite `base` 配置（`/my-website/` 子路径问题不在本次范围；CTA 锚点 `#projects` 在目标模块到位前点击无目标，由后续变更闭环）。
- 不做 i18n / 多语言；文案集中在 `src/data/profile.ts`，结构化但单语言。

## Decisions

### D1. 粒子背景用 Canvas 2D 手写，不引入 three.js / tsparticles

- **方案**：在 `HeroBackground.tsx` 中创建一个 `<canvas>` 元素，组件挂载时获取 2D 上下文，实例化 `Particle[]`，启动 `requestAnimationFrame` 循环；窗口尺寸变化时通过 `ResizeObserver` + `requestAnimationFrame` 节流重设 canvas 尺寸并重算粒子位置。
- **为什么**：满足 config.yaml 性能预算（首屏 < 2s）且包体积零增长。tsparticles 体积过大（gzip 后约 50KB+），three.js 引入的 GL 上下文启动开销对"可选图层"角色过重。
- **替代方案**：
  - three.js / WebGL 粒子：视觉更炫，但首屏 JS parse + GL 上下文建立有可见延迟，且后续变更难以平滑替换。
  - tsparticles：开箱即用但定制空间小，bundle 偏大，主题切换适配成本高。
  - 纯 CSS 渐变 + `box-shadow` 闪烁：完全无 JS 但视觉表现力不足，无法满足"科技感粒子"。

### D2. Tailwind v4 启用 `@variant dark (class &)`，不再使用 `prefers-color-scheme`

- **方案**：在 `src/index.css` 中写：
  ```css
  @import "tailwindcss";
  @variant dark (&:where(.dark, .dark *));
  @custom-variant dark (&:where(.dark, .dark *));
  ```
  切换通过 `<html class="dark">` 控制；同时在 `@theme` 中定义颜色 token（背景、文本、accent 等），替换原 CSS 变量。
- **为什么**：spec 要求"用户手动选择覆盖系统"——class-based 模式才能让用户偏好稳定胜过系统；Tailwind v4 默认 `prefers-color-scheme` 媒体查询，无法实现该语义。
- **替代方案**：
  - 保留 `prefers-color-scheme` 媒体查询 + 在 toggle 内修改 CSS 变量：可行但样式分散在变量和工具类两套体系，长期难维护。
  - 用 `data-theme="dark"` 属性代替 class：等价效果，选用 `dark` class 是 Tailwind 生态默认约定，便于将来粘贴示例。

### D3. 主题初始化脚本在 `index.html` `<head>` 中内联执行，避免 FOUC

- **方案**：在 `index.html` 的 `<head>` 末尾插入一段同步脚本（< 1KB），逻辑：
  1. 读取 `localStorage.theme`；
  2. 若不存在，读取 `matchMedia('(prefers-color-scheme: dark)')`；
  3. 根据结果在 `document.documentElement` 上加 / 移除 `dark` class。
- **为什么**：React 首次渲染前主题必须已就绪；否则会出现 spec 中描述的"先按系统默认显示一帧再切换"。
- **替代方案**：
  - 在 `main.tsx` 顶部同步执行：能避免 React 渲染，但 `<title>` 等已绘制的 HTML 仍会闪；不如 head 内联彻底。
  - 使用 `next-themes` 类库：增加依赖（与"不新增依赖"目标冲突）。

### D4. 主题状态封装在 `useTheme` hook，组件只消费

- **方案**：`useTheme()` 返回 `{ theme: 'light' | 'dark', toggle: () => void }`。内部封装 `localStorage` 读写、`document.documentElement.classList` 同步、跨标签页 `storage` 事件监听（可选，本期不实现）。
- **为什么**：单一信息源，组件不直接接触 `localStorage` 与 DOM 类名，便于单测与替换实现。
- **替代方案**：Context + Provider：可行但当前只有一个消费者（ThemeToggle + 粒子需要 `theme`），hook 更轻量；如果后续扩展到多个消费者再升级为 Context。

### D5. CTA 锚点跳转，不引入路由

- **方案**：CTA 使用 `<a href="#projects">`，点击后浏览器原生滚动到 `#projects`。
- **为什么**：spec 范围内没有 projects 模块；锚点作为占位是最低成本方案，不引入 react-router。
- **替代方案**：
  - `react-router` + 路由占位：过度工程。
  - 暂不做 CTA：放弃 spec 描述能力，不接受。

### D6. 文案集中在 `src/data/profile.ts`

- **方案**：导出 `profile` 对象：
  ```ts
  export const profile = {
    name: '[Your Name]',
    role: '[Your Role]',
    intro: '[一句话自我介绍]',
    ctaLabel: '查看项目',
    ctaHref: '#projects',
  } as const;
  ```
- **为什么**：spec "文案来源单一" 要求；占位字符串保持显式（方括号），避免误以为是已交付内容。
- **替代方案**：直接硬编码在 `Hero.tsx`：违背 spec "文案来源单一"。

### D7. 粒子颜色随主题切换

- **方案**：粒子颜色通过 CSS 变量 `--particle-color` 暴露，主题切换时同步更新该变量；粒子渲染时读取 `getComputedStyle(canvas).getPropertyValue('--particle-color')`。
- **为什么**：粒子层不依赖 React 状态重渲染，避免每帧重绘；通过 CSS 变量天然适配主题。
- **替代方案**：
  - 在 React state 中保存粒子颜色并通过 props 传：每帧 props 变化会导致粒子组件重渲染，浪费。
  - 粒子根据 `background-color` 自动计算对比色：可行但实现复杂，且与 config 主题 token 解耦。

### D8. 全屏高度使用 `100svh` / `100dvh`，而非 `100vh`

- **方案**：CSS 写 `min-h-screen`，在 mobile breakpoint 下用 `min-h-[100svh]`（小视口）或 `min-h-[100dvh]`（动态视口）。
- **为什么**：移动浏览器地址栏弹出/收起会改变可视区域；`100vh` 在 iOS Safari / Android Chrome 上会出现"下方空白条"或跳动（spec 边界场景）。
- **替代方案**：JS 动态计算高度：可行但每次 resize 都要写，CSS 方案更轻。

### D9. `prefers-reduced-motion` 通过 CSS + JS 双重检测

- **方案**：
  - CSS：`@media (prefers-reduced-motion: reduce)` 中将 canvas 设为 `display: none`。
  - JS：`window.matchMedia('(prefers-reduced-motion: reduce)').matches` 决定是否启动 RAF。
- **为什么**：CSS 兜底保证即使 JS 失败也不渲染动画；JS 兜底避免无意义的 RAF 占用主线程。
- **替代方案**：仅 CSS 隐藏 canvas → 节点仍存在但不可见，DOM 仍在；仅 JS 检测 → 用户系统设置变更需要重新订阅。

## Risks / Trade-offs

- **粒子初始化时机与首屏渲染竞争** → 在 React `useEffect` 中启动 RAF，最坏情况是首帧前出现 1 帧空白渐变；通过将渐变底层用 CSS 实现，确保即便粒子未启动 Hero 也已显示。
- **`@variant dark` 在 Tailwind v4 中写法存在版本差异** → 锁定 `tailwindcss@^4.3.3`（已安装），按官方 v4 文档的 `@custom-variant` 写法实现；若后续 Tailwind 升级破坏，向下兼容方案是回退到 `@media (prefers-color-scheme: dark)` 媒体查询版本。
- **CTA 锚点 `#projects` 当前不存在** → 点击后地址栏更新但页面无目标；属已知遗留，由后续 `add-projects-section` 变更闭环，本期不在范围内。
- **`localStorage` 异常分支** → 在隐私模式下可能抛 `SecurityError`；`useTheme` 用 `try/catch` 兜底，主题仍可切换但会话级有效；spec 已要求此行为。
- **粒子数量与设备性能耦合** → 固定粒子数（如 60 颗）在低端机会卡顿；通过 `navigator.hardwareConcurrency` 探测自适应（4 核以下减半），作为实现细节在 tasks 中体现。
- **打印态隐藏** → `@media print` 中 `canvas { display: none }` 与 CTA 隐藏；需在 `index.css` 中集中声明。
- **Hero 删除原 Vite 模板内容** → 一次性删除 demo 是必要的，但若用户在迁移期通过 Vite 模板示例学习 React 状态，会失去脚手架；trade-off：当前仓库尚无任何业务功能，删除成本低。

## Migration Plan

本次变更无外部依赖、无后端、无 schema 迁移。部署步骤：

1. 应用本变更的代码（按 tasks.md 分阶段执行）。
2. 本地 `npm run build` 验证构建通过；`npm run preview` 验证本地预览。
3. 推送至 `main`，触发 GitHub Pages 部署。
4. 访问 `https://<owner>.github.io/my-website/` 验证：
   - 首屏 Hero 渲染正确；
   - 切换主题按钮工作，刷新后保持；
   - 渐变 + 粒子背景可见；
   - 移动端视口（DevTools）下全屏高度稳定。

**回滚**：因为变更集中在新增组件与主题初始化脚本，回滚策略为 `git revert` 提交；`index.html` 的 `lang` 与 `title` 改动独立可逆。

## Open Questions

- 文案占位值（姓名 / 职业 / 一句话）的最终文案 — 维护者后续在 `src/data/profile.ts` 替换，本期不影响实现。
- `#projects` 锚点的真正模块何时引入 — 不在本变更范围；建议下一个变更 `add-projects-section` 时闭环。
