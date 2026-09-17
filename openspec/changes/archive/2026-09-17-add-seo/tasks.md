## 1. index.html meta 标签全量替换

- [x] 1.1 在 `index.html` 的 `<head>` 块内（design D1 + D2 + D5）按以下顺序增 meta 标签：
  - 既有：`<meta charset="UTF-8" />` / `<meta name="viewport" ...>` / `<title>[Your Name] — [Your Role]</title>` / favicon link / 主题内联脚本
  - 新增：`<meta name="description" content="[一句话自我介绍] | 个人品牌站，承载作品与联系方式">`（占位字符串，长度目标 50–160 字符）
  - 新增：`<meta name="author" content="[Your Name]">`
  - 新增：`<link rel="canonical" href="https://[username].github.io/my-website/">`
  - 新增 6 个 og:* 标签（og:title / og:description / og:type=website / og:url / og:image / og:site_name / og:locale=zh_CN）
  - 新增 4 个 twitter:* 标签（twitter:card=summary_large_image / twitter:title / twitter:description / twitter:image）
  - 验证：`grep -c '<meta' index.html` ≥ 10；`grep -E 'og:|twitter:' index.html | wc -l` ≥ 10；`<title>` 与 `<meta property="og:title">` 内容一致；description 长度 `echo "<meta name=\"description\"" content: | wc -c` 在 50–160 区间。 [verify: grep + 内容一致性]
- [x] 1.2 在 `index.html` 顶部（`<!doctype html>` 之上）追加 HTML 注释 `<!-- SEO meta 同步维护：替换 [Your Name] / [Your Role] / [一句话自我介绍] / [username] 时同步更新 src/data/profile.ts -->`（design R1 Mitigation）。验证：`grep -n 'SEO meta 同步维护' index.html` 命中 1 处。 [verify: grep]

## 2. robots.txt + OG image 静态资源

- [x] 2.1 新增 `public/robots.txt`（design D4）：内容 `User-agent: Googlebot` + `Allow: /` + 末尾换行；MIME `text/plain`。验证：`cat public/robots.txt` 输出 `User-agent: Googlebot\nAllow: /\n`；`npm run dev` 后 curl `http://localhost:5173/my-website/robots.txt` 返回 200。 [verify: cat + curl]
- [x] 2.2 新增 `public/og-image.svg`（design D3）：viewBox 1200×630（`viewBox="0 0 1200 630"`），背景 `var(--color-border, #e2e8f0)`，居中文案 `[Your Name] — [Your Role]`，单 `<rect>` + 单 `<text>` 极简结构。验证：文件大小 < 500 字节；`npm run dev` 后 curl `http://localhost:5173/my-website/og-image.svg` 返回 200 + SVG 内容。 [verify: 文件大小 + curl]

## 3. heading 层级审查

- [x] 3.1 列出所有 heading（design D6 + D7）：`grep -nE '<h[1-6]' src/components/*.tsx` 列出 Hero / Projects / Contact / About / ProjectCard 中的 heading。期望：1× `<h1>`（Hero） + 3× `<h2>`（Projects / Contact / About）+ N× `<h3>`（ProjectCard 标题）。验证：grep 输出计数 `<h1>` = 1，`<h2>` ≥ 1，`<h3>` ≥ 1，`<h4>` = 0。 [verify: grep 计数]
- [x] 3.2 验证层级无跳跃：`<h1>` 后 MUST 直接接 `<h2>` 或同级内容；`<h2>` 内 MUST NOT 嵌套 `<h4>` 或更深。验证：人工审查 grep 输出（无自动化手段；接受人工签字）。 [verify: 人工审查]
- [x] 3.3 主题内联脚本不变（design R6）：`grep -n "matchMedia('(prefers-color-scheme: dark)')" index.html` 命中 1 处（既有）。验证：grep 命中。 [verify: grep]

## 4. 构建与端到端验证

- [x] 4.1 跑 `npx tsc -b`，0 错误（SEO 改动不动 TS 源码）。验证：tsc 无 error。 [verify: tsc -b]
- [x] 4.2 跑 `npm run build`，0 错误 0 警告；产物 `dist/index.html` 含全部新增 meta 标签；`dist/robots.txt` 与 `dist/og-image.svg` 存在。验证：`ls dist/` 含 index.html / robots.txt / og-image.svg + 既有 assets；`grep -c '<meta' dist/index.html` ≥ 10。 [verify: build + ls + grep]
- [x] 4.3 跑 `npm run preview` 后 curl 验证 `http://localhost:4173/my-website/robots.txt` 返回 200 + `http://localhost:4173/my-website/og-image.svg` 返回 200；HTML 头部含 og:* + twitter:* + canonical。验证：curl + grep。 [verify: preview + curl + grep]
- [x] 4.4 DevTools 浏览器目视检查社交分享卡模拟：把 og:image URL 填入 https://www.opengraph.xyz/ 或类似工具，验证卡片渲染。验证：肉眼（可选；本任务允许跳过此外部验证）。 [verify: 可选 — 浏览器第三方工具]
- [x] 4.5 heading 层级可视化：DevTools Elements 面板在 Hero 看到唯一 `<h1>`；Projects / Contact / About 各自 `<h2>`；ProjectCard 内 `<h3>`；无 h4+。验证：DevTools Elements 面板肉眼审查。 [verify: DevTools Elements]

## 5. 归档收尾

- [x] 5.1 执行 `openspec validate add-seo`，验证变更零问题。验证：validate 输出 PASSED。 [verify: validate 输出]
- [x] 5.2 执行 `openspec archive add-seo`，把本变更归档到 `openspec/changes/archive/<日期>-add-seo/`；归档同时自动合并 delta —— `seo-support`（new capability）新建 `openspec/specs/seo-support/spec.md`，`hero-section`（modified capability）追加 ADDED 1 Requirement。验证：`openspec list` 中本变更不在活跃列表；归档目录新增。 [verify: openspec list + ls archive/]
- [x] 5.3 校验归档后 7 份变更（`add-hero-section` / `add-projects-section` / `reverify-hero-section` / `add-navigation` / `add-project-section` / `add-about-section` / `add-seo`）并列存在于 `archive/`，且 main specs 含 `seo-support/spec.md` + `hero-section/spec.md`（追加 ADDED 1 Requirement 后总数 = 7）。验证：回报中列出 `archive/` + `specs/` 目录内容 + hero-section spec.md Requirement 数量。 [verify: ls + grep]