# projects-section Specification

## Purpose
为个人品牌站首页在 Hero 区块之后提供 Projects 区块，集中展示个人项目卡片集合，闭合 Hero CTA "查看项目"的跳转目标，并支持点击单张卡片跳转到外部链接。

## Requirements

### Requirement: Projects 区块展示

首页 MUST 在 Hero 区块之后渲染一个 Projects 区块，区块根元素的 `id` MUST 为 `projects`，与 Hero CTA 的 `href="#projects"` 严格一致。区块内 MUST 按维护者配置的 `projects` 数组顺序展示一个项目集合，每一项以卡片形式呈现。

#### Scenario: 区块可见且 ID 一致
- **WHEN** 访客打开网站首页
- **THEN** 首页 MUST 至少包含一个 `id="projects"` 的元素
- **AND** 该元素 MUST 位于 Hero 区块之后（DOM 顺序）

#### Scenario: 列表顺序与配置一致
- **WHEN** 维护者修改 `src/data/projects.ts` 中 `projects` 数组的顺序、增删项
- **THEN** Projects 区块内卡片渲染顺序 MUST 随之变化，无需改动组件代码

#### Scenario: 配置为空数组
- **WHEN** `projects` 数组为空（`length === 0`）
- **THEN** Projects 区块 MUST NOT 渲染任何卡片
- **AND** MUST 在区块内显示"暂无项目"占位文案（避免留白观感突兀）

### Requirement: ProjectCard 内容与可访问性

每张项目卡片 MUST 包含三类内容：标题（一级文字）、简介（一段文字）、标签列表（一组短文字）。卡片整体 MUST 作为可访问的链接元素，访客通过键盘 Tab 到达卡片并按 Enter 时 MUST 触发链接跳转。

#### Scenario: 卡片三要素完整
- **WHEN** Projects 区块渲染任意一张卡片
- **THEN** 该卡片 MUST 同时包含标题、简介、标签列表三项内容
- **AND** 三类内容 MUST 在视觉上按"标题 → 简介 → 标签"自上而下排列

#### Scenario: 卡片可聚焦
- **WHEN** 访客通过键盘 Tab 浏览页面
- **THEN** 卡片 MUST 在 Tab 序列中出现
- **AND** 卡片获得焦点时 MUST 显示清晰的 `:focus-visible` 焦点环

#### Scenario: 卡片键盘激活
- **WHEN** 卡片获得焦点，访客按下 Enter
- **THEN** 行为等同点击（在 `_blank` 时打开新标签；否则当前页跳转）

### Requirement: 卡片跳转行为

每张卡片 MUST 通过其 `href` 字段决定跳转目标。当 `href` 指向外部链接（MUST 以 `http://` 或 `https://` 开头）时，卡片 MUST 在新标签页打开（`target="_blank"` 且 `rel="noopener noreferrer"`）；否则 MUST 在当前页跳转。

#### Scenario: 外部链接新标签打开
- **WHEN** 卡片 `href` 以 `http://` 或 `https://` 开头
- **THEN** 点击后 MUST 在新标签页打开
- **AND** 携带 `rel="noopener noreferrer"`（防止 tabnabbing 与 referrer 泄漏）

#### Scenario: 站内或锚点链接
- **WHEN** 卡片 `href` 为站内路径（如 `/blog/...`）或站内锚点（如 `#section`）
- **THEN** 点击后 MUST 在当前标签页跳转
- **AND** MUST NOT 强制打开新标签页

#### Scenario: href 缺失或非法
- **WHEN** 卡片 `href` 为空字符串或仅含空白字符
- **THEN** 卡片 MUST NOT 渲染为 `<a>` 元素
- **AND** MUST 降级为不可点击的纯展示卡片（避免 `<a href="">` 触发页面刷新）

### Requirement: 主题适配

ProjectCard MUST 复用全站主题基础设施（`<html class="dark">` + `@theme` token），在明亮与暗黑两种模式下均保持文字可读、边框/背景与背景层对比度足够。

#### Scenario: 暗黑模式卡片配色
- **WHEN** 当前主题为暗黑
- **THEN** 卡片背景与边框 MUST 使用暗色 token（如 `bg-background` + `border-border`），文字 MUST 使用前景色 token

#### Scenario: 明亮模式卡片配色
- **WHEN** 当前主题为明亮
- **THEN** 卡片背景与边框 MUST 使用亮色 token，文字 MUST 使用前景色 token
- **AND** hover/focus 状态 MUST 在两种主题下均可见

#### Scenario: 切换主题无错位
- **WHEN** 访客切换主题
- **THEN** 卡片配色 MUST 在下一帧内更新到位（MUST NOT 出现"先按旧主题渲染一帧再切换"的闪烁）

### Requirement: 响应式布局

Projects 区块 MUST 在移动端（视口宽度 < 640px）下保持可用，卡片网格 MUST 自适应列数。

#### Scenario: 移动端单列
- **WHEN** 视口宽度 < 640px
- **THEN** 卡片 MUST 单列垂直堆叠

#### Scenario: 桌面端多列
- **WHEN** 视口宽度 ≥ 640px
- **THEN** 卡片 MUST 排成 2 列网格（`grid-cols-2`）

#### Scenario: 内容不被拉空
- **WHEN** 视口宽度 ≥ 1920px
- **THEN** 区块 MUST 设置最大宽度并居中（不沿用两端对齐），保持视觉重心

### Requirement: Project 数据接口字段（add-project-section）

`Project` 数据接口 MUST 在既有的 `title` / `description` / `tags` / `href` 四字段基础上，增补两个可选字段：`screenshot`（项目截图 URL 或站内占位路径）与 `githubUrl`（GitHub 仓库 URL）。两个字段 MUST 均为字符串类型；空字符串 / 仅含空白字符视为"未提供"。

#### Scenario: 维护者新增项目时填写两字段
- **WHEN** 维护者在 `src/data/projects.ts` 的某条 `Project` 对象中显式给出 `screenshot` 与 `githubUrl`
- **THEN** 该项目卡片 MUST 渲染对应的截图缩略图与 GitHub 链接入口
- **AND** 维护者无需改动组件代码即生效

#### Scenario: 既有字段语义不变
- **WHEN** 维护者保留 `title` / `description` / `tags` / `href` 字段的现有用法
- **THEN** Projects 区块渲染 MUST 与 `add-projects-section` 归档后的既有行为一致（卡片整体跳转、空 href 降级、标签列表等均不变）

### Requirement: 项目截图渲染（add-project-section）

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

### Requirement: GitHub 链接渲染（add-project-section）

当某项目 `githubUrl` 字段非空且为合法 http(s) URL 时，ProjectCard MUST 在卡片底部（标签列表之后或与之并排）渲染一个 GitHub 链接入口，访客点击 MUST 在新标签页打开对应 GitHub 仓库。

#### Scenario: GitHub 链接新标签打开
- **WHEN** 访客点击 GitHub 链接
- **THEN** 浏览器 MUST 在新标签页打开 `githubUrl`
- **AND** MUST 携带 `target="_blank"` 与 `rel="noopener noreferrer"`（防止 tabnabbing 与 referrer 泄漏）

#### Scenario: GitHub 链接 a11y
- **WHEN** 访客通过键盘 Tab 浏览或屏幕阅读器扫描卡片
- **THEN** GitHub 链接 MUST 暴露显式 `aria-label`（默认 `"在 GitHub 上查看 {title}"`，title 缺失时降级为 `"在 GitHub 上查看此项目"`）
- **AND** 链接 MUST 在 Tab 序列中出现
- **AND** 链接获得焦点时 MUST 显示清晰的 `:focus-visible` 焦点环

#### Scenario: githubUrl 字段缺失
- **WHEN** 某项目 `githubUrl` 为空字符串或仅含空白字符
- **THEN** ProjectCard MUST NOT 渲染 GitHub 链接元素
- **AND** MUST NOT 在原链接位置留空 DOM

#### Scenario: GitHub 链接与卡片整体链接并存
- **WHEN** 某项目同时存在 `href`（卡片整体跳转目标）与 `githubUrl`（GitHub 仓库）
- **THEN** 卡片底部 MUST 出现"查看项目 →"文本链接承载 `href` 跳转（add-project-section 的 D2 决策结果：卡片整体改为 `<div>`，跳转由底部链接承载，避免 `<a>` 内嵌 `<a>` 的 HTML5 违规）
- **AND** GitHub 链接 MUST 作为卡片内部的独立 `<a>` 元素
- **AND** 访客点击 GitHub 图标与点击"查看项目 →"的跳转目标 MUST 不同，互不干扰

#### Scenario: githubUrl 非法格式
- **WHEN** `githubUrl` 是非 http(s) 开头的字符串（如 `ftp://` / `javascript:` / 相对路径）
- **THEN** ProjectCard MUST NOT 渲染为可点击链接（避免 XSS 与协议混淆）
- **AND** MUST 退化为不可点击的纯文本占位，行为等同字段缺失
