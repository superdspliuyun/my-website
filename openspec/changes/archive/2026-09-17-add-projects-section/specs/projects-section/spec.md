## Purpose

为个人品牌站首页在 Hero 区块之后提供 Projects 区块，集中展示个人项目卡片集合，闭合 Hero CTA "查看项目"的跳转目标，并支持点击单张卡片跳转到外部链接。

## ADDED Requirements

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
