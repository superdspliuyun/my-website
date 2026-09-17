## Why

个人品牌站目前还没有任何内容区域，访问者落地后只看到 Vite 模板的演示内容，无法在第一屏形成"我是谁 / 我做什么"的认知锚点。本变更通过引入 Hero Section，让访问者在首屏获得清晰的身份信息与品牌第一印象，同时建立"明亮/暗黑模式切换"作为后续所有区块共享的主题基线。

## What Changes

- 新增 `hero-section` capability，提供全屏高度的 Hero 区块：
  - 居中显示姓名（一级标题）、职业（一行小标）、一句话自我介绍（一段说明）。
  - 一个 CTA 按钮（"查看项目"），链接到站内锚点 `#projects`（目标模块当前不存在，作为占位锚点，行为在后续变更中实现）。
  - 背景由两部分叠加：底层 CSS 渐变色 + 上层 Canvas 粒子动画；视觉风格"科技感"。
  - 提供明亮/暗黑模式切换按钮（位置：Hero 右上角），切换结果持久化在 `localStorage`，并在刷新后立即生效，避免主题闪烁。
- 调整 `index.html` 的 `lang="en"` 为 `lang="zh-CN"`，并更新 `<title>` 为个人品牌名（占位值 `[Your Name]` 由后续维护者替换）。
- 引入 Tailwind v4 的 `class`-based 暗色策略（通过 `@variant dark` + `dark` 类名驱动），替换当前 `index.css` 中基于 `prefers-color-scheme` 的变量主题实现，作为后续全站主题基础设施。
- 替换 `App.tsx` 当前模板内容，仅保留 Hero 作为首页唯一可见区域。
- 删除与本次变更无关的 `App.css` 模板样式（迁移到 Tailwind 工具类）。

## Capabilities

### New Capabilities

- `hero-section`：覆盖首页首屏的内容展示、主题切换、粒子背景渲染与响应式适配，定义用户/访客可观察的行为合约。

### Modified Capabilities

无（项目此前未声明任何持久化 capability，因此没有 MODIFIED delta）。

## Impact

- **源码改动**
  - `index.html`：修改 `lang` 与 `<title>`。
  - `src/main.tsx`：在 React 渲染前同步注入主题初始化脚本（读 `localStorage` → 给 `<html>` 加 `dark` 类），避免首屏闪烁。
  - `src/index.css`：替换为 Tailwind v4 主题配置（`@import "tailwindcss"` + `@variant dark (class &)` + `@theme`），保留 `print` 媒体查询对粒子 canvas 的隐藏规则。
  - `src/App.tsx`：替换为 `<Hero />` 单一根组件；删除 `useState` 计数等模板代码。
  - `src/App.css`：删除（不再被引用）。
  - `src/components/Hero.tsx`：新增，承担排版与 CTA。
  - `src/components/HeroBackground.tsx`：新增，Canvas 粒子层（自包含 RAF 循环、`prefers-reduced-motion` 检测、`resize` 节流）。
  - `src/components/ThemeToggle.tsx`：新增，亮/暗切换按钮。
  - `src/hooks/useTheme.ts`：新增，主题状态 hook（封装读取/写入 `localStorage` 与 `document.documentElement.classList` 同步）。
  - `src/data/profile.ts`：新增，集中存放姓名 / 职业 / 一句话 / CTA 文案（占位值），便于后续替换。
- **API / 后端**：无（明确不做后端 API）。
- **依赖**：不新增 npm 包；所有功能基于既有 React 19 + Vite + Tailwind v4。
- **性能影响**
  - Canvas 粒子层是首屏唯一非文本渲染工作，需满足 config.yaml 中"首屏加载 < 2 秒"约束；通过限制 DPR 上限、节流 resize、`prefers-reduced-motion` 时跳过 RAF 来控制成本。
  - 主题初始化脚本内联在 `<head>`，体积 < 1KB，不引入额外网络请求。
- **对现有功能的影响**
  - 替换 App.tsx → 原 Vite 模板内容（react/vite logos、计数器、文档/社交链接区块）将被移除。这是项目本身尚未交付任何"业务功能"前提下的全量替换，不影响真实用户路径。
  - 删除 App.css → 任何依赖其类名（`.hero`, `.counter`, `#center`, `#next-steps`, `#social`, `#spacer`, `.ticks`）的外部引用将失效；当前未发现此类引用。
  - `index.css` 主题切换方式从 `prefers-color-scheme`（媒体查询）切换为 `class`-based → 这是行为变更：未手动选择主题的访客将不再跟随系统设置（本次变更加入"未选时默认跟随系统"逻辑，详见 spec）。
- **部署**：本次变更不修改 Vite `base` 配置；CTA 锚点 `#projects` 在目标模块到位前为"点击无目标"，属已知遗留，由后续变更闭环。
