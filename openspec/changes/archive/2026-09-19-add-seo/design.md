# Design

## Context

当前 `index.html` 仍使用 `vite-scaffold-temp` 标题，只包含 charset、viewport 和 favicon；应用本身已使用 `header/nav/main/section` 等部分语义容器，但需要做一致性审查。部署目标是 GitHub Pages `/my-website/`，且项目没有 sitemap 或 SEO runtime dependency。

## Goals / Non-Goals

**Goals:**

- 在静态 HTML head 中集中提供基础 SEO、Open Graph、Twitter Card 和 Person JSON-LD。
- 使用 GitHub Pages base path 生成可替换的 canonical、URL 和预览图路径。
- 新增可被静态服务器直接返回的 `public/robots.txt`，允许公开页面抓取。
- 审查页面语义标签、标题层级和可访问关联，不改变视觉布局。

**Non-Goals:**

- 不引入 React Helmet、SEO SaaS、Analytics、Search Console 或 sitemap 生成器。
- 不创建完整 sitemap、不承诺排名、不添加动态 metadata 管理后台。

## Decisions

### 静态 head 优先

直接修改 `index.html`，因为本项目是 Vite 单页静态站，搜索引擎和社交平台可以在不执行应用状态逻辑的情况下读取 metadata。相比运行时 React metadata 库，静态 head 更简单且减少依赖。

### 使用可替换的 GitHub Pages URL 常量

canonical、`og:url`、Twitter URL 和 JSON-LD 的 `url` 使用 `/my-website/` 部署地址的占位配置，并在注释/文档中标明替换点；资源路径使用 `/my-website/` 前缀，避免部署到项目页面时指向根域名错误路径。

### JSON-LD 使用 Person

使用内联 `application/ld+json` 描述“小飞侠”、职业“天马行空”和可选 `sameAs` profile 列表。未提供真实 profile 时不填入虚假 URL；这比引入 schema 库更轻量。

### robots.txt 明确允许抓取

新增 `public/robots.txt`，使用 `User-agent: *` 与 `Allow: /`，并写入 `/my-website/sitemap.xml` 的可替换声明。即使 sitemap 文件尚未提供，robots 文件本身仍然有效，不阻止索引。

### 语义化审查不改变视觉

保留现有 Tailwind class，仅在必要处检查 `main`、`nav`、`section`、`h1`/`h2` 层级和 `aria-labelledby`；避免把语义审查扩大为页面重构。

## Risks / Trade-offs

- [canonical URL 配置错误] → 集中标记可替换 URL，并在构建后检查最终 HTML 路径。
- [预览图不存在] → metadata 使用可替换路径，社交平台缺图时仍显示标题和摘要。
- [JSON-LD 包含过时 profile] → 仅保留维护者明确填写的 `sameAs` URL，默认不伪造社交链接。
- [robots 允许抓取未完成内容] → 仅对公开首页和静态内容允许抓取，不加入后台或敏感路径规则。

## Migration Plan

1. 更新 `index.html` head 并添加 JSON-LD、Open Graph、Twitter Card。
2. 新增 `public/robots.txt`，检查 GitHub Pages base path。
3. 审查应用语义标签和标题层级，运行 lint/build。
4. 用构建产物检查 title、description、canonical、结构化数据和 robots 内容；如需回滚，移除新增 metadata 与 robots 文件即可。
