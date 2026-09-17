# contact-section Specification

## Purpose

为个人品牌站首页 Projects 区块之后提供联系入口占位，集中展示维护者邮箱与一句话联系说明，使 Nav "联系我"链接有可靠目标，并为后续扩展（社交链接、联系表单）留出语义锚点。

## Requirements

### Requirement: 联系区块展示

首页 MUST 在 Projects 区块之后渲染一个 Contact 区块，区块根元素的 `id` MUST 为 `contact`，与 Nav "联系我"链接的 `href="#contact"` 严格一致。区块内 MUST 至少包含一行说明文字与一个邮箱入口。

#### Scenario: 区块可见且 ID 一致
- **WHEN** 访客打开网站首页
- **THEN** 首页 MUST 至少包含一个 `id="contact"` 的元素
- **AND** 该元素 MUST 位于 Projects 区块之后（DOM 顺序）

#### Scenario: 点击 Nav 联系跳转
- **WHEN** 访客点击 Nav "联系我"链接
- **THEN** 页面 MUST 平滑滚动至 Contact 区块，Contact 区块 MUST 进入视口

### Requirement: 文案与邮箱来源单一

Contact 区块内的所有可见文案（标题、说明文字、邮箱地址） MUST 来自 `src/data/profile.ts` 同一配置点；维护者修改任一字段后 MUST 无需改动组件代码即生效。

#### Scenario: 修改邮箱生效
- **WHEN** 维护者更新 `profile.email`
- **THEN** Contact 区块内显示的邮箱地址 MUST 同步更新
- **AND** 邮箱链接的 `mailto:` 目标 MUST 同步更新

#### Scenario: 修改标题生效
- **WHEN** 维护者更新 `profile.contactTitle`
- **THEN** Contact 区块标题 MUST 同步更新

#### Scenario: 修改说明文字生效
- **WHEN** 维护者更新 `profile.contactIntro`
- **THEN** Contact 区块说明文字 MUST 同步更新

### Requirement: 邮箱链接行为

Contact 区块内 MUST 渲染一个邮箱链接元素，访客点击 MUST 唤起系统邮件客户端（`mailto:` 协议）。链接 MUST 同时以纯文本形式展示邮箱地址，便于访客直接复制。

#### Scenario: 点击邮箱唤起邮件客户端
- **WHEN** 访客点击邮箱链接
- **THEN** 浏览器 MUST 按 `mailto:` 协议唤起默认邮件客户端，预填收件人为 `profile.email`

#### Scenario: 邮箱可被键盘激活
- **WHEN** 邮箱链接通过键盘 Tab 获得焦点
- **THEN** 邮箱链接 MUST 显示清晰的 `:focus-visible` 焦点环
- **AND** 访客按下 Enter MUST 等同点击

### Requirement: 字段缺失兜底

Contact 区块 MUST 对标题、说明、邮箱三个字段分别做空字符串 / 纯空白兜底：任一字段为空时 MUST NOT 渲染空 DOM 占位（避免留白），其余字段仍正常渲染。

#### Scenario: 邮箱缺失
- **WHEN** `profile.email` 为空字符串或仅含空白字符
- **THEN** Contact 区块 MUST NOT 渲染邮箱链接元素
- **AND** MUST 在原邮箱位置显示占位文案"[邮箱地址]"，且 MUST NOT 渲染为可点击元素

#### Scenario: 标题缺失
- **WHEN** `profile.contactTitle` 为空字符串或仅含空白字符
- **THEN** Contact 区块 MUST NOT 渲染空标题元素，其余字段仍正常渲染

#### Scenario: 说明文字缺失
- **WHEN** `profile.contactIntro` 为空字符串或仅含空白字符
- **THEN** Contact 区块 MUST NOT 渲染空段落元素，其余字段仍正常渲染

### Requirement: 主题适配

Contact 区块 MUST 复用全站主题基础设施（`<html class="dark">` + `@theme` token），在明亮与暗黑两种模式下均保持文字可读、邮箱链接可视、邮箱地址对比度足够。

#### Scenario: 暗黑模式配色
- **WHEN** 当前主题为暗黑
- **THEN** Contact 区块背景与文字 MUST 使用暗色 token（如 `bg-background` + `text-foreground`），邮箱链接 MUST 使用 accent token

#### Scenario: 明亮模式配色
- **WHEN** 当前主题为明亮
- **THEN** Contact 区块背景与文字 MUST 使用亮色 token，邮箱链接 MUST 使用 accent token
- **AND** hover/focus 状态 MUST 在两种主题下均可见

#### Scenario: 切换主题无错位
- **WHEN** 访客切换主题
- **THEN** Contact 区块配色 MUST 在下一帧内更新到位（MUST NOT 出现"先按旧主题渲染一帧再切换"的闪烁）

### Requirement: 响应式布局

Contact 区块 MUST 在桌面端（视口宽度 ≥ 640px）与移动端（视口宽度 < 640px）下均保持可用，文字与邮箱链接均不被遮挡。

#### Scenario: 移动端单列
- **WHEN** 视口宽度 < 640px
- **THEN** Contact 区块内容 MUST 单列垂直堆叠
- **AND** 邮箱链接 MUST 完整可见，不出现横向滚动条

#### Scenario: 桌面端居中
- **WHEN** 视口宽度 ≥ 640px
- **THEN** Contact 区块 MUST 设置最大宽度并居中（与 Projects 一致的 `max-w-5xl mx-auto`），邮箱链接居中或左对齐均可

#### Scenario: 大屏不被拉空
- **WHEN** 视口宽度 ≥ 1920px
- **THEN** Contact 区块 MUST 设置最大宽度并居中（不沿用两端对齐）