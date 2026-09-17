## Purpose

为个人品牌站提供 SEO 与社交身份基础——`index.html` 必须包含搜索引擎与社交分享爬虫所需的关键 meta 标签，`public/robots.txt` 声明爬虫行为，保证首页在 Google 索引与社交分享场景下均有可用的摘要与卡片。

## ADDED Requirements

### Requirement: HTML 基础 meta 标签

`index.html` 的 `<head>` MUST 包含以下 SEO 与社交身份 meta 标签，且 MUST 在 React 渲染前已正确（爬虫 / 分享爬虫只看静态 HTML）。

#### Scenario: 标题与描述
- **WHEN** 爬虫访问首页并查看 `<head>`
- **THEN** MUST 包含 `<title>`，且 MUST 含 `[Your Name]` 与 `[Your Role]` 占位字段（由维护者替换为真实姓名 / 职业）
- **AND** MUST 包含 `<meta name="description" content="...">`，长度 MUST 在 50–160 字符之间，含个人简介核心信息

#### Scenario: 作者与 canonical
- **WHEN** 爬虫访问首页
- **THEN** MUST 包含 `<meta name="author" content="...">`（占位 `[Your Name]` 或维护者配置）
- **AND** MUST 包含 `<link rel="canonical" href="https://[username].github.io/my-website/">`（声明权威 URL）

#### Scenario: 字符集与语言
- **WHEN** 爬虫解析首页 HTML
- **THEN** MUST 含 `<meta charset="UTF-8">`（既有）
- **AND** MUST 含 `<html lang="zh-CN">`（既有）
- **AND** MUST 含 `<meta name="viewport" content="width=device-width, initial-scale=1.0">`（既有）

### Requirement: OpenGraph 标签

`index.html` MUST 包含 OpenGraph 协议标签，使社交分享（Twitter / Slack / LinkedIn / 微信）能渲染富卡片。

#### Scenario: OG 基础标签
- **WHEN** 社交爬虫抓取首页
- **THEN** MUST 包含：
  - `<meta property="og:title" content="...">` （与 `<title>` 同源）
  - `<meta property="og:description" content="...">` （与 description 同源）
  - `<meta property="og:type" content="website">`
  - `<meta property="og:url" content="https://[username].github.io/my-website/">`
  - `<meta property="og:image" content="https://[username].github.io/my-website/og-image.svg">`
  - `<meta property="og:site_name" content="...">` （含 `[Your Name]` 占位）
  - `<meta property="og:locale" content="zh_CN">`

### Requirement: Twitter Card 标签

`index.html` MUST 包含 Twitter Card 协议标签，使推文分享渲染富卡片。

#### Scenario: Twitter 卡片
- **WHEN** Twitter 爬虫抓取首页
- **THEN** MUST 包含：
  - `<meta name="twitter:card" content="summary_large_image">`
  - `<meta name="twitter:title" content="...">` （与 og:title 同源）
  - `<meta name="twitter:description" content="...">` （与 og:description 同源）
  - `<meta name="twitter:image" content="https://[username].github.io/my-website/og-image.svg">`

### Requirement: robots.txt

`public/robots.txt` MUST 存在，仅允许 Google 爬虫索引。

#### Scenario: Google 爬虫允许
- **WHEN** Googlebot 访问 `https://[username].github.io/my-website/robots.txt`
- **THEN** MUST 返回 HTTP 200
- **AND** 内容 MUST 含 `User-agent: Googlebot` + `Allow: /`
- **AND** MUST NOT 声明任何 `Disallow:` 规则（默认全站允许）

#### Scenario: 其他爬虫未声明
- **WHEN** 其他爬虫（如 Bingbot / Baiduspider）访问 robots.txt
- **THEN** 文件 MUST NOT 包含针对它们的 `User-agent:` 块（按用户决策"仅允许 Google"，其他爬虫走默认行为——无 User-agent 块即未授权亦未禁止，由各爬虫自身默认策略决定）

### Requirement: OG 分享图

`public/og-image.svg` MUST 存在，作为 OG / Twitter Card 的占位分享图。

#### Scenario: 分享图加载
- **WHEN** 社交爬虫抓取 og:image URL
- **THEN** MUST 返回 HTTP 200
- **AND** MUST 是 SVG（MIME `image/svg+xml`），viewBox 1200×630（标准 OG 比例）
- **AND** MUST 含居中文案 `[Your Name] — [Your Role]`（占位字段由维护者替换）

### Requirement: heading 层级审查

首页所有 `<h1>` / `<h2>` / `<h3>` MUST 形成严格的层级结构（h1 唯一 → h2 多区 → h3 子项）；不得出现层级跳跃（h1 → h3）或过深层级（h4+）。

#### Scenario: h1 唯一性
- **WHEN** 维护者审查首页所有 heading
- **THEN** MUST 有且仅有 1 个 `<h1>`（位于 Hero 区块）
- **AND** 其他区块 MUST 起始于 `<h2>`（Projects / Contact / About）

#### Scenario: h3 嵌套层级
- **WHEN** ProjectCard 渲染项目标题
- **THEN** MUST 使用 `<h3>`（作为 Projects 区块 `<h2>` 的下一级）
- **AND** MUST NOT 使用 `<h4>` 或更深层级

#### Scenario: 无 heading 跳跃
- **WHEN** 维护者审查 DOM 结构
- **THEN** MUST NOT 出现 `<h2>` 直接嵌套 `<h4>` 的层级跳跃
- **AND** MUST NOT 出现 `<h1>` 后直接 `<h3>`（缺 `<h2>`）

### Requirement: 主题基础设施不变

本变更 MUST NOT 影响项目主题机制。

#### Scenario: 主题切换无影响
- **WHEN** SEO meta 标签新增 / 静态占位字符串修改
- **THEN** `<html class="dark">` 内联脚本（`index.html` line 5-13） MUST 保持不变
- **AND** ThemeToggle 行为、`<html lang="zh-CN">` MUST 保持不变