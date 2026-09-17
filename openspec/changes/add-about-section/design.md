## Context

当前首页（`src/App.tsx`）DOM 顺序：`<Navigation /> → <Hero /> → <Projects /> → <Contact />`。Hero 区块受限于首屏粒子背景与 100svh 满屏定位，仅能承载姓名 / 职业 / 一句话（spec「Hero 内容展示」三要素）。Projects / Contact 区块已分别承担"作品"与"联系"职责，但缺少"关于维护者本人"的独立展示。本变更在 Hero 与 Projects 之间插入 About 区块（DOM 顺序：Nav → Hero → About → Projects → Contact），并相应增 Nav 第 4 个 `#about` 链接。

`src/data/profile.ts` 现有 `name` / `role` / `intro` / `ctaLabel` / `ctaHref` / `navLabels` / `email` / `contactTitle` / `contactIntro` 共 4 顶层 + 1 嵌套字段。About 区块新增 `aboutPortrait` / `aboutParagraphs` / `aboutBrandTag` 三个字段，沿用既有"占位字符串以方括号显式呈现"约定。

`src/components/Navigation.tsx` 现有 1 个品牌名 + 3 个链接（`#hero` / `#projects` / `#contact`）。需在 `#hero` 与 `#projects` 之间插入第 4 个 `#about` 链接（spec「关于链接新插入位置」）。

## Goals / Non-Goals

**Goals:**

- 新增 About 区块，承载照片 + 3 段简介 + 品牌标签三要素。
- 照片使用 `loading="lazy"` + 主题感知边框，与 add-project-section 的 placeholder SVG 模式一致。
- Nav 增第 4 个 `#about` 链接（位置在"首页"与"项目"之间），既有的 3 个链接行为 / 主题 / a11y 全部保留。
- 既有 Hero / Projects / Contact 区块代码与 spec **完全不变**；App.tsx 仅在 Hero 与 Projects 之间插入 `<About />`。
- 不动 hero-section / projects-section / contact-section 的既有 spec。

**Non-Goals:**

- 不做联系我的表单（out-of-scope 1）。
- 不做照片轮播 / 多图画廊 / 视频背景。
- 不做社交媒体链接 / 技能条 / 时间线 / 简历下载按钮。
- 不修改 navigation-section 的既有 REQUIREMENTS 字面（除放宽"3 个 → 4 个"与新增一条 ADDED Requirement 外）。
- 不引入新 npm 依赖；图片用内联 SVG 占位 + 后续维护者替换 URL 即可。

## Decisions

### D1：区块结构 —— 左照片 + 右简介 + 下品牌标签

About 区块根元素 `<section id="about" aria-label="关于我">`，内部用 Tailwind grid 工具类做响应式两栏：

```tsx
<section className="relative w-full border-t border-border bg-background px-6 py-20">
  <div className="mx-auto max-w-5xl">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr]">
      {/* 左：照片 */}
      <img ... />
      {/* 右：3 段简介 */}
      <div className="space-y-4">
        {aboutParagraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
    {/* 下：品牌标签（占两栏宽度） */}
    <p className="mt-12 text-2xl font-semibold text-accent">{aboutBrandTag}</p>
  </div>
</section>
```

理由：
- 桌面端 `md:grid-cols-[auto_1fr]` 让照片宽度自适应（自然尺寸），右侧简介占剩余空间，符合"左固定 + 右弹性"模式。
- 移动端 `grid-cols-1` 单列垂直堆叠（照片在上、简介在中、品牌标签在下）。
- 品牌标签 `mt-12` 跳出 grid 容器，居于下方独立位置。

被否决方案：
- 三栏布局（左照片 + 中简介 + 右品牌标签）—— 品牌标签与简介关联度更强（都是文字），应纵向堆叠而非横向并列。
- 把品牌标签放进两栏 grid 内 —— 视觉上"左照片 + 右简介与品牌标签"，信息密度失衡。

### D2：照片占位 —— 内联 SVG 替代外部图片

照片占位 SVG 存放于 `public/about/portrait.svg`（与 add-project-section 的 `public/projects/placeholder-N.svg` 模式一致）：

- viewBox 4:5（`viewBox="0 0 800 1000"`，人像纵向比例）或 1:1（`viewBox="0 0 800 800"）—— 取 4:5 突出人像感
- 背景用 token `var(--color-border, #e2e8f0)`
- 居中文案 `[个人照片]`
- 单 `<rect>` + 单 `<text>` 极简结构，~400 字节

被否决方案：
- 用 `<div>` + 文字作为占位 —— 与 spec「照片渲染」"MUST 渲染 `<img>` 元素" 不一致。
- 用第三方占位图服务（placehold.co）—— 引入外部网络请求，违反 CLAUDE.md 静态部署原则。

### D3：字段缺失兜底 —— 沿用 `hasContent` 模式

About 区块 3 个新字段（`aboutPortrait` / `aboutParagraphs` / `aboutBrandTag`）的兜底统一沿用 projects-section / contact-section 既有 `hasContent` 模式（`hasContent(s: string)` 用 `.trim().length > 0` 判定）：

```tsx
const hasPortrait = hasContent(aboutPortrait ?? '');
const hasBrandTag = hasContent(aboutBrandTag ?? '');
const visibleParagraphs = (aboutParagraphs ?? []).filter(p => hasContent(p));
```

`visibleParagraphs` 处理"简介为空数组"与"某段为空"两种场景，渲染时仅遍历非空段。

### D4：Nav 第 4 个链接插入位置 —— "首页"与"项目"之间

Nav 链接顺序固定（spec「四个链接固定存在」不允许配置改顺序），第 4 个 `#about` 链接插入位置：

```
[品牌名]    [首页] [关于] [项目] [联系我]
```

位置选择理由：
- "关于"内容上紧跟 Hero（自我展示的延伸），放在 Hero 锚点对应的"首页"之后；
- "项目"是工作成果，是"关于"的下一阶段（从人到作品）；
- 这种顺序符合"从人到作品"的阅读路径，与 DOM 顺序 Nav → Hero → About → Projects → Contact 一致。

Navigation.tsx 既有 3 个 `<a>` 渲染分支不变，新增第 4 个：

```tsx
<a href="#about" className={linkClass}>{about}</a>
```

`profile.navLabels.about` 字段随之新增（与既有 `home` / `projects` / `contact` 同级）。

### D5：主题适配 —— 全 token 化

About 区块所有 className 仅用 token 类名：
- 根 `<section>`：`border-t border-border bg-background`（与 Projects / Contact 一致）
- 照片：`border border-border object-cover`
- 简介：`text-muted leading-relaxed`
- 品牌标签：`text-accent`（accent 主题感知）
- 响应式：`grid-cols-1 md:grid-cols-[auto_1fr]`

零内联 style；零硬编码颜色。符合 CLAUDE.md "样式全部使用 Tailwind CSS，禁止内联 style"。

### D6：组件命名与目录 —— PascalCase + 平铺

新增文件：
- `src/components/About.tsx`

修改文件：
- `src/data/profile.ts`：增 `aboutPortrait` / `aboutParagraphs` / `aboutBrandTag` 三字段。
- `src/components/Navigation.tsx`：增第 4 个 `<a href="#about">` 链接（位置：home / projects 之间）。
- `src/App.tsx`：JSX 顺序变 `<Navigation /> → <Hero /> → <About /> → <Projects /> → <Contact />`。

新增静态资源：
- `public/about/portrait.svg`：个人照片占位（~400 字节）。

## Risks / Trade-offs

- [R1] Nav 从 3 个链接扩为 4 个链接，移动端窄屏下可能拥挤。→ Mitigation：Nav 既有 `gap-1 sm:gap-2` 与 `h-14` 单行 flex 布局；4 个链接总宽度（含左右 padding）约 280px，远小于移动端 320px 视口；如实测拥挤，立后续 change 启用汉堡菜单（既有 out-of-scope）。
- [R2] 品牌标签"赋范空间"占位字符串如用方括号 `[赋范空间]` 会与文字标签视觉冲突。→ Mitigation：`aboutBrandTag` 默认值"赋范空间"（无方括号），与 Contact / Hero 既有 `ctaLabel` "查看项目" 风格一致；占位仅在字段值为空时降级到 `[品牌标签]`。
- [R3] 照片 alt 文本默认"个人照片"较通用，对屏幕阅读器不够具体。→ Mitigation：spec 已允许维护者后续替换时填入更具体的 alt（通过新字段 `aboutPortraitAlt?: string` 或后期增字段）；本期为简化设计不引入新字段。
- [R4] Nav 第 4 个链接修改 navigation-section 既有 REQUIREMENTS 字面（"3 个 → 4 个"），归档时 main spec 会被 delta spec 整体覆盖；既有 `a11y` Requirement 的 Scenario 字面（"Tab 顺序含三个链接"）未修改，仍可读为"含三个或更多链接"——delta spec 已通过 ADDED Requirement 显式声明 Tab 序列含 5 个可聚焦元素（品牌名 + 4 链接），避免歧义。
- [R5] About 区块照片使用 `loading="lazy"`，首屏 Hero 区块后立即插入 About，可能在桌面端首屏就可见 —— lazy loading 不影响"已可见"图片的延迟加载策略，对 hero-section spec「首屏可交互时间 < 2 秒」无影响。

## Migration Plan

本变更无运行时与部署新功能：

1. 按 tasks Phase 顺序实现；
2. 每 Phase 本地 build 校验；
3. 归档时自动合并 delta：
   - `about-section`（new capability）→ 新建 `openspec/specs/about-section/spec.md`
   - `navigation-section`（modified capability）→ delta spec 合并到 `openspec/specs/navigation-section/spec.md`（MODIFIED "区块跳转链接" Requirement + ADDED "关于链接的渲染与 a11y" Requirement）
4. GitHub Pages 走现有自动部署。

回滚策略：`git revert` 整次 commit 即可；新增字段为可选，向后兼容（既有 profile 数据无 `aboutPortrait` 等字段时降级为字段缺失，渲染为空）。

## Open Questions

无。
- 照片比例 4:5 vs 1:1：design D2 取 4:5（人像感更强），如维护者偏好正方形可改 1 个 viewBox 值即可，不阻塞。
- Nav 第 4 个链接位置：D4 明确"首页 / 关于 / 项目 / 联系我"，与 DOM 顺序一致。
- 字段缺失兜底：D3 沿用 `hasContent` 模式，与既有项目一致。