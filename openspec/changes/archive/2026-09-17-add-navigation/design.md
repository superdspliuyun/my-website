## Context

当前首页（`src/App.tsx`）已包含 `<Hero />` 与 `<Projects />` 两个区块，对应 `id="projects"`（`Projects.tsx:17`），Hero 区块无 `id`；主题切换按钮固定在 Hero 右上角（`Hero.tsx:28-30`）。本变更新增顶栏 + Contact 区块，需协调：
- Hero 必须暴露 `id="hero"` 给 Nav "首页"链接；
- Hero 右上角 ThemeToggle 与 Nav 不互相遮挡；
- Projects 锚点 `#projects` 与 Nav "项目"链接指向同一目标，行为一致。

文案集中点 `src/data/profile.ts` 当前持有 `name / role / intro / ctaLabel / ctaHref`，本变更在其上扩展导航与联系相关字段。

## Goals / Non-Goals

**Goals:**

- 在不动 React 19 + Vite 7 + Tailwind v4 技术栈、不引入新依赖的前提下交付顶栏与联系区块。
- 平滑滚动、模糊背景、主题切换均通过 Tailwind 工具类或纯 CSS 实现，避免引入 JS 动画库。
- 与 Hero / Projects 已建立的 `@theme` token 体系保持一致；零硬编码颜色。

**Non-Goals:**

- 不引入 IntersectionObserver 高亮当前 section（见 proposal out-of-scope 4–5）。
- 不做移动端汉堡菜单 + 抽屉。
- 不引入动画库（Framer Motion / GSAP 等）；如需额外过渡，CSS-only 即可。
- 不修改 hero-section / projects-section 既有 spec REQUIREMENTS。

## Decisions

### D1：定位策略 —— `fixed` 而非 `sticky`

顶栏使用 `fixed top-0 inset-x-0 z-40`（Tailwind）固定定位，理由：

- 三个锚点目标（Hero / Projects / Contact）分布在视口不同位置，`sticky` 需要父容器达到边界才生效，在 Hero 已被 100svh 占满的布局下会出现"前几屏不固定"的奇怪行为。
- `fixed` 在所有滚动位置都贴顶，与 spec "滚动中始终可见" 的需求对齐。
- `z-40` 高于 Hero 内容层（`z-10`）但低于模态等未来可能扩展的层级，预留栈空间。

被否决方案：`sticky top-0` —— 因父容器高度问题，Hero 区域不滚动时无效。

### D2：模糊背景 —— Tailwind `backdrop-blur` + 半透明 token

顶栏背景使用 `bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60`，理由：

- `bg-background/70` 复用现有 `@theme` token；亮 / 暗两主题下均与下方内容形成足够对比。
- `backdrop-blur` 是 Tailwind v4 内建工具类（对应 `backdrop-filter: blur(...)`），零运行时 JS。
- `supports-[backdrop-filter]:bg-background/60` 利用 CSS `@supports` 渐进增强：在支持 backdrop-filter 的浏览器降低不透明度以让模糊生效，在不支持的浏览器使用 60% 不透明兜底（Tailwind v4 原生支持 `supports-[...]` 任意特性查询）。

被否决方案：手写 `style={{ backdropFilter: 'blur(8px)' }}` —— 不符合 CLAUDE.md "禁止内联 style"。

### D3：平滑滚动 —— 纯 CSS + `prefers-reduced-motion` 兜底

在 `src/index.css`（全局）追加：

```css
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

理由：

- 浏览器原生 `scroll-behavior: smooth` 已能满足"点击锚点 → 平滑滚动"，无需 JS（`element.scrollIntoView({ behavior: 'smooth' })`）。
- `prefers-reduced-motion` 通过 CSS `@media` 退化为 `auto`，对应 spec "减少动效时即时跳转"。
- 零运行时开销，零依赖。

被否决方案：`scrollIntoView({ behavior: 'smooth' })` JS 实现 —— 增加状态/事件代码量，且 `prefers-reduced-motion` 检测需额外代码。

### D4：Nav 与 Hero ThemeToggle 的层级协调

Hero 右上角的 ThemeToggle 已存在（`Hero.tsx:28-30`，`<div className="absolute right-4 top-4 z-10 print:hidden">`）。

- Nav 使用 `fixed top-0 z-40`；ThemeToggle 在 `absolute top-4 right-4`。
- 当 Nav 出现后，ThemeToggle 在 Hero 顶部位置（距 Nav 底约 1rem 间距），视觉上 Nav 在 ThemeToggle 上层（z-40 > z-10），但 ThemeToggle 仍可点（Nav 是横向条带，ThemeToggle 在其右下角区域下方，浏览器层级不冲突）。
- 两者职责明确分离：Nav 管跳转，ThemeToggle 管主题切换；out-of-scope 已声明不做 Nav 内嵌主题切换。

被否决方案：把 ThemeToggle 移进 Nav 右侧 —— 改动范围超出本变更，且破坏 hero-section spec "Hero 右上角提供切换按钮" 的 REQUIREMENTS。

### D5：Hero 锚点 —— 属性层补全，不改 spec

`<Hero />` 根 `<section>` 当前为 `<section aria-label="自我介绍">`，无 `id`。本变更在根 `<section>` 上追加 `id="hero"`（仅属性变化），不改 aria-label、不改内容、不改 spec。

- 这是 spec 之外的小属性协调，hero-section spec 的"Scenario: 点击 CTA"等 REQUIREMENTS 不受影响。
- 若不补 `id="hero"`，Nav "首页"链接 `#hero` 跳转无目标；故本协调是 Nav 落地的必要条件。

### D6：文案配置 —— 在 `profile.ts` 上扩展 5 个字段

在现有 `profile` 对象（`src/data/profile.ts:6-12`）追加：

```ts
email: '[your-email@example.com]',
contactTitle: '联系我',
contactIntro: '欢迎通过邮件与我交流。',
navLabels: {
  home: '首页',
  projects: '项目',
  contact: '联系我',
},
```

字段全部以方括号显式占位（与现有 `role` / `intro` 占位约定一致）。Contact 区块与 Nav 文案均从 profile 单点读取，符合现有 "文案来源单一" 模式（hero-section / projects-section 均已遵守）。

被否决方案：把导航文案硬编码在 Nav 组件内部 —— 违反既有 spec "文案来源单一"，且后续维护成本高。

### D7：链接激活态 —— 留白给后续 change

本变更不做"滚动监听高亮当前 section"。Nav 三个链接视觉态仅 hover + focus 两种（来自 `hover:text-accent` + `focus-visible:ring-2`），不存在"当前 section 对应链接加粗/下划线"的 active state。

理由：见 proposal out-of-scope 第 5 条。

### D8：Contact 区块结构 —— 镜像 Projects 的简单模式

Contact 区块复用 Projects 的样式模式：

- 根元素 `<section id="contact" aria-label="联系入口">`，`relative w-full border-t border-border bg-background px-6 py-20`。
- 容器 `<div className="mx-auto max-w-5xl">` 与 Projects 一致。
- 内容：标题 `<h2>` + 简介 `<p>` + 邮箱链接 `<a href={`mailto:${profile.email}`}>`，邮箱缺失时退化为 `<p className="text-muted">[邮箱地址]</p>` 占位。

被否决方案：把 Contact 区块设计成复杂表单 —— 远超本变更范围，且 out-of-scope 第 3 条明确不做登录注册。

### D9：组件命名与目录 —— PascalCase + 平铺

新增文件：

- `src/components/Navigation.tsx`（spec "导航栏展示 / 跳转 / 平滑 / 模糊 / 主题" 对应）
- `src/components/Contact.tsx`（spec "Contact 区块 / 邮箱 / 文案兜底" 对应）

修改文件：

- `src/App.tsx`：在 `<Hero />` 前追加 `<Navigation />`、在 `<Projects />` 后追加 `<Contact />`。
- `src/components/Hero.tsx`：根 `<section>` 增补 `id="hero"`。
- `src/data/profile.ts`：增补 5 个字段。
- `src/index.css`：增补 `scroll-behavior` 全局规则。

文件命名遵循 CLAUDE.md "组件文件名使用 PascalCase"。

## Risks / Trade-offs

- [R1] `fixed` 顶栏占用首屏顶部 ~64px，可能与 Hero 居中内容争抢空间 → Mitigation：Nav 高度限制为 `h-16`（64px）以下；Hero 内容 `py-16` 已有顶部内边距，Hero 文字不会顶到 Nav 下沿；桌面端 + 移动端均验证。
- [R2] `backdrop-blur` 在低端 GPU / Android 旧机型可能有滚动卡顿 → Mitigation：Tailwind `supports-[backdrop-filter]:bg-background/60` 提供降级；性能预算 spec（hero-section "首屏可交互时间 < 2 秒"）不变。
- [R3] Nav 与 ThemeToggle 在小屏窄宽度下可能视觉拥挤 → Mitigation：ThemeToggle 仍固定在 Hero 内部（`absolute right-4 top-4`），Nav 自身最右端无额外元素；小屏下两者视觉错位但不重叠；若实测确有遮挡，再立后续 change。
- [R4] `mailto:` 链接在用户未配置邮件客户端时无反应 → Mitigation：邮箱地址同时以纯文本形式渲染，访客可直接复制；spec 已要求"链接 MUST 同时以纯文本形式展示邮箱地址"。
- [R5] Hero 区块增补 `id="hero"` 是隐性改动，可能让后续维护者误以为是新需求 → Mitigation：在 Hero.tsx 顶部 JSDoc 注释一行说明 `id="hero"` 是 add-navigation change 的协调改动。

## Migration Plan

本变更属前端纯渲染层调整，无需数据迁移或部署步骤：

1. 按 tasks.md Phase 顺序实现；
2. 每完成一个 Phase，本地 `npm run dev` + `npm run build` 校验；
3. 归档后（archive）一并合并 delta specs 到 `openspec/specs/navigation-section/spec.md` 与 `openspec/specs/contact-section/spec.md`；
4. GitHub Pages 部署走现有自动流程，base path 仍 `/my-website/`，Nav / Contact 的所有锚点仅在本页内跳转，无路由变更。

回滚策略：归档后若发现问题，可 `git revert` 整次 commit；同时 OpenSpec 提供 `openspec archive` 后的归档目录中保有 proposal / specs / design / tasks 完整记录，便于审计与恢复。

## Open Questions

无。当前设计已涵盖所有 spec REQUIREMENTS 与 Tasks 落地所需的实现细节；剩余的"是否做汉堡菜单 / 是否做 active-link 高亮"已落入 proposal out-of-scope，不阻塞本变更。