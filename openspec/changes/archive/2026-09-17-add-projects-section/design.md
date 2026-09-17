## Context

`hero-section` 已交付：Hero 占满首屏，文案集中于 `src/data/profile.ts`，主题基础设施（`@theme` token、`useTheme`、`ThemeToggle`、`<html class="dark">` 切换）已建立并对全站开放复用。Hero CTA "查看项目" 当前跳转到 `#projects`，但该锚点对应的区块尚未交付——这是 `add-hero-section` 设计文档 Open Questions 明确记录的已知遗留。

本变更交付 Projects 区块本身（闭合 CTA 真目标），复用 Hero 已建立的主题基础设施，**不引入新依赖、不修改 Hero 组件代码**。提案动机与行为合约见 `proposal.md` 与 `specs/projects-section/spec.md`；本文件只覆盖"如何实现"。

## Goals / Non-Goals

**Goals:**
- 提供 Projects 区块（`id="projects"`），单页闭环 Hero CTA 跳转。
- 提供项目卡片网格 + 单卡片交互 + 主题适配 + 响应式布局。
- 与 Hero 共享主题基础设施：组件代码不直接读写 `localStorage`，只通过 `useTheme` 与 token 适配。
- 文案与项目数据集中在 `src/data/projects.ts`（数组常量），便于后续维护者替换。
- 卡片外部链接安全：`target="_blank"` 必带 `rel="noopener noreferrer"`。

**Non-Goals（设计层面，排除提案已声明的红线之外的额外取舍）:**
- 不引入路由系统（react-router 等）；站内锚点 + 卡片 `<a href>` 已足够。
- 不引入卡片内容图标库（lucide / heroicons 等）；标签与图标占位用纯文本或内联 SVG。
- 不引入动画库（framer-motion / react-spring 等）；hover/focus 微动效用 Tailwind transition 完成。
- 不引入客户端筛选/分页/排序逻辑；`projects` 数组即最终顺序。
- 不处理 SEO meta / Open Graph；本期仅静态文案与 `<a>` 链接。
- 不修改 Vite `base` 配置；CTA 锚点跳转不依赖 base path。

## Decisions

### D1. 区块根元素为 `<section id="projects">`，与 Hero CTA `href="#projects"` 严格一致

- **方案**：`Projects.tsx` 的根 JSX 为 `<section id="projects" ...>`，Hero 中 CTA 的 `href={profile.ctaHref}` 仍为 `"#projects"`（不动 `profile.ts`）。
- **为什么**：浏览器原生 `<a href="#x">` 跳转依赖目标 DOM 元素 `id` 完全匹配——任何拼写差异（`Projects` / `project` / 大小写）都会导致"点击无目标"回归。让 `id` 字面量与 `profile.ctaHref` 都集中在两个常量中，并各自加单元测试断言。
- **替代方案**：
  - 用 `scrollIntoView()` 通过 ref 触发滚动：可行但失去原生语义（地址栏 URL 不更新），与 spec "页面跳转至 `#projects` 锚点" 不一致。
  - 把 `id` 提到 `profile.ts` 作为配置项：增加维护成本、收益微小。

### D2. ProjectCard 渲染为 `<a>` 或 `<div>`，依据 `href` 是否有效

- **方案**：`ProjectCard` 内部 `const isLink = hasContent(href) && /^https?:\/\//.test(href);`；外部链接渲染为 `<a target="_blank" rel="noopener noreferrer">`，站内/锚点渲染为 `<a>`，空 href 渲染为 `<div>` 纯展示。
- **为什么**：spec 要求"href 缺失或非法 MUST 降级为不可点击的纯展示卡片"——`<a href="">` 会触发页面刷新，这是已知反模式。
- **替代方案**：
  - 统一渲染 `<a>`，依赖 `pointer-events: none` 控制禁用：可行但 DOM 语义错误（屏幕阅读器仍会朗读"链接"）。
  - 引入 `<Button as={Link}>` 抽象（react-aria / radix）：过度工程，本期仅一种元素。

### D3. 数据集中于 `src/data/projects.ts`，数组 + 单条类型

- **方案**：
  ```ts
  export interface Project {
    title: string;
    description: string;
    tags: readonly string[];
    href: string;
  }
  export const projects: readonly Project[] = [
    { title: '[项目 1]', description: '[简介]', tags: ['[标签1]'], href: 'https://example.com' },
    // ...
  ] as const;
  ```
- **为什么**：与 `profile.ts` 单文案源模式对齐；占位字符串显式方括号，便于后续替换；`as const` + `readonly` 防止误改。
- **替代方案**：
  - 从 JSON 文件 `import`：可行但增加 import 路径；本期数据小、内联即可。
  - CMS / Markdown 解析：远超本期范围。

### D4. 主题适配通过 Tailwind v4 `@theme` token，不写硬编码颜色

- **方案**：ProjectCard 使用 `bg-background`、`border-border`、`text-foreground`、`text-muted`、`hover:bg-accent-hover` 等 token；不写 `#fff` / `#000`。
- **为什么**：与 Hero 设计 D2 一致；明亮/暗黑切换由 `<html class="dark">` 统一驱动，组件零感知。
- **替代方案**：
  - 在组件内 `useTheme` 读主题后动态拼 className：可行但性能差且重复 Hero 已建立的模式。
  - 写两套 className（`bg-white dark:bg-zinc-900`）：可行但 token 化更易维护。

### D5. 栅格通过 Tailwind 工具类 `grid grid-cols-1 sm:grid-cols-2`

- **方案**：`Projects.tsx` 容器写 `grid grid-cols-1 gap-6 sm:grid-cols-2`；卡片 `max-w-3xl mx-auto` 控制最大宽度。
- **为什么**：spec 要求"移动端单列 / 桌面端多列 / 大屏不拉空"，三个需求用三个 Tailwind 工具类即可。
- **替代方案**：
  - CSS Grid + `auto-fit minmax`：可行但与 Tailwind 风格不一致。
  - 引入 `react-grid-layout`：过度工程，本期是静态网格。

### D6. 配置空数组显示"暂无项目"占位文案

- **方案**：`Projects.tsx` 顶部 `if (projects.length === 0) return <section id="projects">暂无项目</section>;`。
- **为什么**：spec "Projects 区块展示" Scenario 要求"避免留白观感突兀"；与 Hero `hasContent()` 文案缺失兜底思路一致。
- **替代方案**：什么都不渲染——直接 `<section id="projects" />`；违背 spec。

### D7. 滚动行为交由浏览器原生处理，不写 JS

- **方案**：不调用 `scrollIntoView` / `scroll-behavior: smooth`；保留浏览器默认行为。
- **为什么**：浏览器原生 `<a href="#x">` 跳转已包含定位；项目站点追求简单，不引入额外行为。
- **替代方案**：CSS `scroll-behavior: smooth` 全局生效——会增加 CSS 全局规则，本期收益不明显。

## Risks / Trade-offs

- **Projects 区块没有视觉分隔** → 在 `Projects.tsx` 根容器加 `border-t border-border` 或 `py-20` 留白，与 Hero 区分；tasks 阶段确定。
- **标签列表长度不固定** → 卡片高度可能因标签行数不同而错位；用 `h-full` + flex column 让卡片高度一致；或允许高度差异（更自然）。
- **占位数据曝光** → 与 Hero 一致用 `[占位]` 形式；维护者替换前站点可上线但有视觉空缺。
- **CTA 与 Projects ID 拼写不一致** → 在 tasks 中加一条断言性验证（grep `id="projects"` 与 `href="#projects"`）。
- **大量项目时滚动性能** → 本期固定 3–6 条占位数据，不涉及虚拟滚动；未来扩展时再评估。
- **打印态** → ProjectCard 是否需要 `print:hidden`？本期 spec 未要求，保留渲染；可在后续变更按需调整。

## Migration Plan

无 schema 迁移、无外部依赖。部署步骤：

1. 应用本变更的代码（按 tasks.md 分 Phase 推进）。
2. 本地 `npm run build` 验证构建通过；`npm run preview` 验证本地预览。
3. 推送至 `main`，触发 GitHub Pages 部署。
4. 访问 `https://<owner>.github.io/my-website/` 验证：
   - 首页滚动到 Projects 区块可见（Hero CTA 跳转闭环）；
   - 卡片网格在桌面端为 2 列、移动端单列；
   - 主题切换时卡片配色同步变化。

**回滚**：纯增量变更，回滚策略为 `git revert` 提交；不影响 Hero 已有行为。

## Open Questions

- 占位项目数据（标题 / 简介 / 标签 / href）的最终值——维护者后续在 `src/data/projects.ts` 替换，本期不影响实现。
- 卡片 hover 是否需要微动画（如 `hover:-translate-y-1` 上浮）——属实现细节，tasks 阶段根据 Hero 风格决定；本期 spec 未要求。
