## Context

当前首页 SEO 基础设施仅含 `<html lang="zh-CN">` 与静态占位 `<title>[Your Name] — [Your Role]</title>`（`index.html:5`），无 `<meta name="description">` / canonical / OpenGraph / Twitter Card / robots.txt / og-image.svg。Hero 区块渲染 `<h1>{profile.name}</h1>`、`<p>{profile.role}</p>`、`<p>{profile.intro}</p>` 三要素；Projects / Contact 区块起始 `<h2>`；ProjectCard 用 `<h3>{title}</h3>`。heading 层级结构基本合理（h1 → h2 → h3），但 `<title>` 与 `profile` 字段名的占位字符串一致性、description 长度、heading 嵌套深度需系统审查。

`public/` 当前仅有 `projects/placeholder-{1..4}.svg`（来自 add-project-section）；`about/portrait.svg`（如已合并来自 add-about-section）。本期新增 `public/robots.txt` 与 `public/og-image.svg`。

`index.html` 当前结构：
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>[Your Name] — [Your Role]</title>
    <script>/* 主题内联脚本（hero-section spec「刷新后保留偏好」）*/
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

主题内联脚本（`script` 块） MUST 保持不变（hero-section spec「刷新后保留偏好」/「用户偏好高于系统变更」）。

## Goals / Non-Goals

**Goals:**

- `index.html` 在 React 渲染前已含 SEO 与社交身份 meta 标签全集（title / description / author / canonical / og:* / twitter:*）。
- `public/robots.txt` 声明仅允许 Google 爬虫。
- `public/og-image.svg` 作为 OG / Twitter Card 占位图。
- heading 层级审查：h1 单次 → h2 多区 → h3 子项；无 h4+ 或层级跳跃。
- 不引入新 npm 依赖；不修改 Vite 配置；不修改 `profile.ts`；不修改任何组件源码（除 heading 层级审查外）。

**Non-Goals:**

- 不做 JSON-LD / Schema.org（out-of-scope 1）。
- 不做 sitemap.xml / Sitemap 声明（out-of-scope 2）。
- 不做多语言 / hreflang（out-of-scope 3）。
- 不做 favicon / apple-touch-icon / mask-icon 套件（out-of-scope 4）。
- 不做 SEO 性能优化（out-of-scope 5）。
- 不做 OG 图片动态生成（out-of-scope 6）。
- 不做 React useEffect 动态 title（out-of-scope 7；保持纯静态）。
- 不引入 react-helmet-async 等元数据管理库（out-of-scope 9）。

## Decisions

### D1：index.html 标签静态占位而非构建期注入

`<title>` / `<meta name="description">` / og:* / twitter:* 全部用静态占位字符串（`[Your Name]` / `[Your Role]` / `[一句话自我介绍]`），与 `profile.ts` 字段占位一致。维护者替换占位即可生效。

理由：
- Vite SPA + GitHub Pages 部署，爬虫/分享爬虫只看静态 HTML（React mount 后的 DOM 更新对它们不可见）。
- 静态占位符合 CLAUDE.md "占位字符串以方括号显式呈现" 约定（profile.ts 既有）。
- 不引入 Vite plugin 或 react-helmet，避免构建系统复杂度。

被否决方案：
- Vite `transformIndexHtml` 钩子 + 自定义 plugin 从 `profile.ts` 注入真实值 —— 增加构建复杂度，且与项目"占位字符串"约定冲突。
- React 19 useEffect 动态 title —— 爬虫/分享爬虫只看静态 HTML，运行时更新无效。

### D2：description 文案来源 = `profile.intro`

`<meta name="description">` 占位字符串使用 `[一句话自我介绍]`，与 `profile.intro` 字段占位一致。维护者将 `profile.intro` 改为实际文案时，同时替换 description 内容。OG 与 Twitter description 与 description 同源。

理由：
- 单一文案源（profile.ts）；与 hero-section 既有"文案来源单一"约定一致。
- 长度天然 50–160 字符（hero `intro` 设计为一句话）。

### D3：og:image 用 SVG 而非 PNG/JPG

OG 分享图用 `public/og-image.svg`（1200×630 viewBox，与 design D2 一致；极简 `<rect>` + `<text>`）。维护者后续可替换为真实 PNG/JPG，URL 路径不变。

理由：
- 极简（~300 字节），不影响首屏加载。
- SVG 占位与 add-project-section / add-about-section 的占位 SVG 模式一致。
- Vite 静态资源自动复制到 `dist/`。

被否决方案：
- PNG/JPG 占位 —— 二进制资源不利于版本控制 diff；占位阶段 SVG 已够用。

### D4：robots.txt 仅允许 Google 爬虫

`public/robots.txt` 内容：

```
User-agent: Googlebot
Allow: /
```

理由：
- 用户明确要求"仅允许 Google 爬虫"。
- 不声明其他爬虫（按默认行为：未授权亦未禁止）。
- 不附 Sitemap（out-of-scope）。

被否决方案：
- `User-agent: *` + `Allow: /` —— 这会让所有爬虫被允许，违背"仅 Google"语义。
- 含 Sitemap 声明 —— out-of-scope 2。

### D5：canonical 指向 `https://[username].github.io/my-website/`

`<link rel="canonical" href="https://[username].github.io/my-website/">` 占位。维护者替换 `[username]` 即可。

理由：
- GitHub Pages 个人站点默认 URL 模式（user.github.io）。
- 项目根 vite.config.ts `base: '/my-website/'` 确认 base path（已在 OpenSpec config.yaml 中标注）。
- 占位字符串保持 `[username]` 与项目默认占位风格一致。

### D6：heading 层级审查 = h1 单次 + h2 多区 + h3 子项，无 h4+

审查清单：
- Hero：`<h1>{profile.name}</h1>` — 单次 ✅
- Projects / Contact / About（若已合并）：各自 `<h2>` — 多区 ✅
- ProjectCard：`<h3>{title}</h3>` — 子项 ✅
- Contact / About 内部 MUST NOT 出现 `<h4>` 或更深

审查方式：`grep -nE '<h[1-6]' src/components/` 列出所有 heading，逐项核对。
- 审查视角：heading 数量、层级顺序、是否在 `<section>` 内顶部。
- 若发现问题（如 ProjectCard 内部嵌套 `<h4>`），降级或删除；本次不写"完美"修复，统一降级为合理层级。

### D7：组件文件改动范围

仅做 heading 层级审查与微调（不改组件语义 / 不动 props / 不动 className）。具体审查对象：
- `src/components/Hero.tsx`：`<h1>`（既有）
- `src/components/Projects.tsx`：`<h2>`（既有）
- `src/components/Contact.tsx`：`<h2>`（既有）
- `src/components/About.tsx`（如已合并）：`<h2>`（既有）
- `src/components/ProjectCard.tsx`：`<h3>{title}</h3>`（既有）

不修改任何组件代码（除非审查发现 heading 层级问题需要降级）。本决策的"组件文件改动"实际上等价于"审查 + 零改动或微调"。

### D8：favicon 状态保留

`<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`（`index.html:6`）保留，但 `public/favicon.svg` 不在本期新增（out-of-scope 4）。浏览器访问 `/favicon.svg` 会 404，不影响 SEO 关键路径。

## Risks / Trade-offs

- [R1] 静态占位字符串 `[username]` / `[Your Name]` 等需要维护者手动同步替换 index.html 与 profile.ts——两份"我维护者文案"分散。→ Mitigation：在 `index.html` 顶部加 HTML 注释 `<!-- SEO meta 同步维护：替换 [Your Name] / [Your Role] / [一句话自我介绍] / [username] 时同步更新 src/data/profile.ts -->`；spec 已在 hero-section ADDED Requirement 显式声明"维护者替换占位"。
- [R2] 描述长度依赖人工约束 50–160 字符。→ Mitigation：spec「description 长度 MUST 在 50–160 字符之间」作为硬约束；构建产物 dist/index.html 由 grep 验证。
- [R3] OG image 是 SVG，部分社交爬虫对 SVG og:image 支持不全（仅支持 PNG/JPG）。→ Mitigation：本期占位；维护者后续替换为 PNG/JPG 时 URL 路径不变；spec 已在「OG 分享图加载」Scenario 注明"维护者替换为真实 PNG/JPG"。
- [R4] heading 审查可能发现既有层级问题（如某个组件误用 `<h4>`）；修复时可能影响视觉层级提示。→ Mitigation：审查仅在发现问题时降级或删除；不为了"修复"新增 heading。
- [R5] 本变更不影响 SEO 性能（critical CSS / preload / WebP 等），仅做基础 meta。→ Mitigation：spec 显式声明"最小可交付 SEO 基线"，后续立 change 做性能优化。
- [R6] `index.html` 主题内联脚本 MUST 保持不变（hero-section spec「刷新后保留偏好」）；本变更不修改该脚本位置或内容。→ Mitigation：tasks 4.1 显式 grep `matchMedia('(prefers-color-scheme: dark)')` 在 index.html 中命中作为不变性验证。

## Migration Plan

本变更无运行时与部署新功能：

1. 按 tasks Phase 顺序实现：
   - Phase 1：`index.html` meta 标签全量替换；
   - Phase 2：`public/robots.txt` + `public/og-image.svg` 新增；
   - Phase 3：heading 层级审查 + 微调（按审查结果）；
   - Phase 4：构建 + E2E + 归档。
2. 归档时自动合并 delta：
   - `seo-support`（new capability）→ 新建 `openspec/specs/seo-support/spec.md`；
   - `hero-section`（modified capability）→ delta 合并到 `openspec/specs/hero-section/spec.md`（ADDED 1 Requirement）。
3. GitHub Pages 走现有自动部署；robots.txt 与 og-image.svg 作为 public/ 静态资源会被 Vite 复制到 dist/。

## Open Questions

无。
- 占位字符串 vs 构建期注入（D1）：选静态占位，简单且符合既有约定。
- OG image 格式（D3）：选 SVG 占位，与 add-project-section / add-about-section 一致；维护者后续可替换 PNG/JPG。
- robots.txt 范围（D4）：仅 Google 爬虫，明确不含其他爬虫与 sitemap。