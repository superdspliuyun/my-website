## ADDED Requirements

### Requirement: HTML 静态 SEO meta 标签

首页的 `index.html` MUST 在 `<head>` 中包含搜索引擎与社交分享爬虫所需的关键 meta 标签，且 MUST 在 React 渲染前已正确（爬虫 / 分享爬虫只看静态 HTML，不等 React mount）。本 Requirement 与 `seo-support` 独立 spec 的"HTML 基础 meta 标签"REQUIREMENT 强关联：后者定义具体 meta 项，本 Requirement 强调其在 Hero 区块语义上的对齐——`<title>` 与 `<meta name="description">` MUST 与 Hero 区块的内容三要素（姓名 / 职业 / 一句话）一致。

#### Scenario: title 与 Hero 姓名 / 职业对齐
- **WHEN** 维护者更新 `profile.name` 或 `profile.role`
- **THEN** `index.html` 的 `<title>` MUST 含 `[Your Name]` 与 `[Your Role]` 占位字段（占位字符串由维护者替换为新值；本期不做构建期注入）
- **AND** `<title>` 渲染 MUST 在爬虫视图（静态 HTML）中与 Hero 区块 `<h1>{profile.name}</h1>` 文案一致

#### Scenario: description 与 Hero 简介对齐
- **WHEN** 维护者更新 `profile.intro`
- **THEN** `<meta name="description" content="...">` MUST 含 `profile.intro` 占位字段（占位字符串由维护者替换为新值；本期不做构建期注入）
- **AND** description 长度 MUST 在 50–160 字符之间

#### Scenario: OG 与 description 同源
- **WHEN** 维护者更新 `profile.intro`
- **THEN** `<meta property="og:description">` 与 `<meta name="twitter:description">` MUST 与 description 同源（占位字符串由维护者一并替换）