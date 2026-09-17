## ADDED Requirements

### Requirement: Project 数据接口字段

`Project` 数据接口 MUST 在既有的 `title` / `description` / `tags` / `href` 四字段基础上，增补两个可选字段：`screenshot`（项目截图 URL 或站内占位路径）与 `githubUrl`（GitHub 仓库 URL）。两个字段 MUST 均为字符串类型；空字符串 / 仅含空白字符视为"未提供"。

#### Scenario: 维护者新增项目时填写两字段
- **WHEN** 维护者在 `src/data/projects.ts` 的某条 `Project` 对象中显式给出 `screenshot` 与 `githubUrl`
- **THEN** 该项目卡片 MUST 渲染对应的截图缩略图与 GitHub 链接入口
- **AND** 维护者无需改动组件代码即生效

#### Scenario: 既有字段语义不变
- **WHEN** 维护者保留 `title` / `description` / `tags` / `href` 字段的现有用法
- **THEN** Projects 区块渲染 MUST 与 `add-projects-section` 归档后的既有行为一致（卡片整体跳转、空 href 降级、标签列表等均不变）

### Requirement: 项目截图渲染

当某项目 `screenshot` 字段非空时，ProjectCard MUST 在卡片顶部（位于标题之前）渲染一张 16:9 宽高比的截图缩略图。截图 MUST 使用 `loading="lazy"` 推迟加载，避免阻塞首屏；MUST 提供描述性 `alt` 文案（默认 `{title} 项目截图`）。

#### Scenario: 截图加载策略
- **WHEN** 视口滚动至 Projects 区块且卡片进入视口
- **THEN** 截图 MUST 在卡片进入视口后才开始加载（`loading="lazy"` 生效）
- **AND** 首屏渲染时 MUST NOT 因截图加载阻塞 Hero 内容出现

#### Scenario: 截图 alt 文案
- **WHEN** 维护者未显式提供 alt 文本（`screenshot` 字段是字符串 URL，不含 alt）
- **THEN** 渲染 MUST 使用 `alt="{title} 项目截图"` 作为默认描述
- **AND** 当 `title` 缺失时 MUST 降级为 `alt="项目截图"`

#### Scenario: screenshot 字段缺失
- **WHEN** 某项目 `screenshot` 为空字符串或仅含空白字符
- **THEN** ProjectCard MUST NOT 渲染 `<img>` 元素
- **AND** MUST NOT 在原截图位置留空白 DOM（避免视觉突兀），卡片直接以"无截图"状态从标题开始渲染

#### Scenario: 截图加载失败
- **WHEN** 浏览器加载 `screenshot` URL 失败（404 / 网络异常）
- **THEN** ProjectCard MUST 不抛出未捕获异常
- **AND** 浏览器原生 broken image 占位 MUST 出现于卡片顶部，不影响标题 / 简介 / 标签的渲染

### Requirement: GitHub 链接渲染

当某项目 `githubUrl` 字段非空时，ProjectCard MUST 在卡片底部（标签列表之后或与之并排）渲染一个 GitHub 链接入口，访客点击 MUST 在新标签页打开对应 GitHub 仓库。

#### Scenario: GitHub 链接新标签打开
- **WHEN** 访客点击 GitHub 链接
- **THEN** 浏览器 MUST 在新标签页打开 `githubUrl`
- **AND** MUST 携带 `target="_blank"` 与 `rel="noopener noreferrer"`（防止 tabnabbing 与 referrer 泄漏）

#### Scenario: GitHub 链接 a11y
- **WHEN** 访客通过键盘 Tab 浏览或屏幕阅读器扫描卡片
- **THEN** GitHub 链接 MUST 暴露显式 `aria-label`（默认 `"在 GitHub 上查看 {title}"`，title 缺失时降级为 `"在 GitHub 上查看此项目"`）
- **AND** 链接 MUST 在 Tab 序列中出现（位于卡片整体链接之后或之前均可，但 MUST 与卡片整体链接区分以避免双焦点）
- **AND** 链接获得焦点时 MUST 显示清晰的 `:focus-visible` 焦点环

#### Scenario: githubUrl 字段缺失
- **WHEN** 某项目 `githubUrl` 为空字符串或仅含空白字符
- **THEN** ProjectCard MUST NOT 渲染 GitHub 链接元素
- **AND** MUST NOT 在原链接位置留空 DOM

#### Scenario: GitHub 链接与卡片整体链接并存
- **WHEN** 某项目同时存在 `href`（卡片整体跳转目标）与 `githubUrl`（GitHub 仓库）
- **THEN** 卡片整体 MUST 仍可点击跳转到 `href`（既有行为不变）
- **AND** GitHub 链接 MUST 作为卡片内部的独立 `<a>` 元素，与卡片整体的 `<a>` 形成嵌套（HTML5 规范禁止 `<a>` 内嵌 `<a>`，故卡片整体改为 `<div>` 包裹 GitHub 链接；该调整在 design D2 中说明，对外行为保持可点击卡片 + 独立 GitHub 入口）
- **AND** 访客点击 GitHub 图标与点击卡片其余区域的跳转目标 MUST 不同，互不干扰

#### Scenario: githubUrl 非法格式
- **WHEN** `githubUrl` 是非 http(s) 开头的字符串（如 `ftp://` / `javascript:` / 相对路径）
- **THEN** ProjectCard MUST NOT 渲染为可点击链接（避免 XSS 与协议混淆）
- **AND** MUST 退化为不可点击的纯文本占位，行为等同字段缺失