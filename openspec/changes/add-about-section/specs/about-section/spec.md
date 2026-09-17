## Purpose

为个人品牌站首页 Hero 区块之后提供"关于我"区块，集中展示个人照片、3 段个人简介与品牌标签，使访客对维护者本人形成完整画像，并让顶部 Nav "关于"链接（navigation-section）有可靠的站内锚点目标。

## ADDED Requirements

### Requirement: About 区块展示

首页 MUST 在 <Hero /> 区块之后、<Projects /> 区块之前渲染一个 About 区块，区块根元素的 `id` MUST 为 `about`，与 Nav "关于"链接的 `href="#about"` 严格一致。区块内 MUST 至少包含三个视觉元素：左侧照片、中部简介文字、底部品牌标签。

#### Scenario: 区块可见且 ID 一致
- **WHEN** 访客打开网站首页
- **THEN** 首页 MUST 至少包含一个 `id="about"` 的元素
- **AND** 该元素 MUST 位于 Hero 区块之后、Projects 区块之前（DOM 顺序）

#### Scenario: 点击 Nav 关于跳转
- **WHEN** 访客点击 Nav "关于"链接
- **THEN** 页面 MUST 平滑滚动至 About 区块，About 区块 MUST 进入视口
- **AND** 浏览器地址栏的 URL 片段 MUST 同步更新为 `#about`

### Requirement: 关于字段来源单一

About 区块内的所有可见内容（照片 URL、3 段简介文字、品牌标签） MUST 来自 `src/data/profile.ts` 同一配置点；维护者修改任一字段后 MUST 无需改动组件代码即生效。

#### Scenario: 修改个人简介生效
- **WHEN** 维护者更新 `profile.aboutParagraphs` 中的任一段文字
- **THEN** About 区块内对应段落的可见文字 MUST 同步更新
- **AND** 段数由 `aboutParagraphs.length` 决定（非硬编码"3 段"）

#### Scenario: 修改品牌标签生效
- **WHEN** 维护者更新 `profile.aboutBrandTag`
- **THEN** About 区块底部品牌标签 MUST 同步显示新文案

#### Scenario: 修改照片 URL 生效
- **WHEN** 维护者更新 `profile.aboutPortrait`
- **THEN** About 区块左侧 `<img>` 的 `src` MUST 同步更新

### Requirement: 区块结构与视觉布局

About 区块 MUST 采用两栏布局：左侧为照片，中部为简介文字（3 段），底部为品牌标签。

#### Scenario: 桌面端两栏
- **WHEN** 视口宽度 ≥ 640px
- **THEN** About 区块 MUST 渲染为左照片 + 右简介的两栏网格（`grid-cols-[photo,text]` 或 `md:grid-cols-2`）
- **AND** 品牌标签 MUST 居于简介下方（不在两栏内）

#### Scenario: 移动端单列堆叠
- **WHEN** 视口宽度 < 640px
- **THEN** About 区块 MUST 渲染为单列垂直堆叠（照片在上、简介在中、品牌标签在下）
- **AND** 不出现水平滚动条

### Requirement: 照片渲染

About 区块左侧 MUST 渲染个人照片占位。照片 MUST 使用 `loading="lazy"` 推迟加载；MUST 提供 `alt` 文案（默认"个人照片"）。

#### Scenario: 照片加载策略
- **WHEN** 视口滚动至 About 区块且照片进入视口
- **THEN** 照片 MUST 在进入视口后才开始加载（`loading="lazy"` 生效）
- **AND** 首屏 MUST NOT 因照片加载阻塞 Hero 区块渲染

#### Scenario: 照片字段缺失
- **WHEN** `profile.aboutPortrait` 为空字符串或仅含空白字符
- **THEN** About MUST NOT 渲染 `<img>` 元素
- **AND** MUST NOT 在原照片位置留空 DOM（避免视觉突兀），两栏布局退化为单栏（仅简介 + 品牌标签）

#### Scenario: 照片加载失败
- **WHEN** 浏览器加载 `aboutPortrait` URL 失败（404 / 网络异常）
- **THEN** About MUST 不抛出未捕获异常
- **AND** 浏览器原生 broken image 占位 MUST 出现，不影响简介 / 品牌标签的渲染

### Requirement: 简介段数与字段缺失兜底

About 区块 MUST 渲染 `profile.aboutParagraphs` 中所有非空段落（trim 后非空白字符）。

#### Scenario: 简介为 3 段
- **WHEN** `profile.aboutParagraphs` 长度 = 3 且 3 段均非空
- **THEN** About 区块 MUST 渲染恰好 3 个段落

#### Scenario: 简介不足 3 段
- **WHEN** `profile.aboutParagraphs` 长度 < 3（如 1 段或 2 段）或某段为空
- **THEN** About MUST 仅渲染非空段
- **AND** 段与段之间 MUST 保持视觉间距（如 `space-y-4`）

#### Scenario: 简介为空数组
- **WHEN** `profile.aboutParagraphs` 为空数组（`length === 0`）
- **THEN** About MUST NOT 渲染任何 `<p>` 元素
- **AND** MUST NOT 在原简介位置留空白 DOM

### Requirement: 品牌标签渲染

About 区块底部 MUST 渲染一个品牌标签元素（`profile.aboutBrandTag`），作为个人品牌名 / 身份标识的视觉锚点。

#### Scenario: 品牌标签显示
- **WHEN** `profile.aboutBrandTag` 非空
- **THEN** About 区块底部 MUST 渲染该标签
- **AND** 标签视觉上 MUST 与简介文字区分（如更大字号 / 不同颜色 / 描边边框）

#### Scenario: 品牌标签缺失
- **WHEN** `profile.aboutBrandTag` 为空字符串或仅含空白字符
- **THEN** About MUST NOT 渲染品牌标签元素
- **AND** MUST NOT 在原位置留空 DOM

### Requirement: 主题适配

About 区块 MUST 复用全站主题基础设施（`<html class="dark">` + `@theme` token），在明亮与暗黑两种模式下均保持文字可读、照片边框对比度足够、品牌标签视觉一致。

#### Scenario: 暗黑模式配色
- **WHEN** 当前主题为暗黑
- **THEN** 简介文字 MUST 使用前景色 token（如 `text-foreground` / `text-muted`），照片边框 MUST 使用 `border-border` token，品牌标签 MUST 主题感知

#### Scenario: 明亮模式配色
- **WHEN** 当前主题为明亮
- **THEN** 简介文字 / 照片边框 / 品牌标签 MUST 使用对应亮色 token
- **AND** 主题切换 MUST 在下一帧内到位，无闪烁

### Requirement: 可访问性

About 区块 MUST 暴露无障碍语义：根元素为 `<section>` + 显式 `aria-label`；照片有 `alt`；简介与品牌标签层级清晰。

#### Scenario: 屏幕阅读器扫描
- **WHEN** 屏幕阅读器扫描 About 区块
- **THEN** 根 `<section>` MUST 暴露 `aria-label="关于我"`（或等价标识）
- **AND** 照片 MUST 暴露 `alt` 文本
- **AND** 简介 MUST 以语义化 `<p>` 标签呈现

### Requirement: 响应式布局

About 区块 MUST 在桌面端（视口宽度 ≥ 640px）与移动端（视口宽度 < 640px）下均保持可用。

#### Scenario: 移动端单列
- **WHEN** 视口宽度 < 640px
- **THEN** 照片 + 简介 + 品牌标签 MUST 单列垂直堆叠
- **AND** 不出现水平滚动条

#### Scenario: 桌面端两栏
- **WHEN** 视口宽度 ≥ 640px
- **THEN** 区块 MUST 设置最大宽度并居中（与 Projects / Contact 一致的 `max-w-5xl mx-auto`）
- **AND** 1920px 大屏下 MUST 不被拉空

### Requirement: 打印态

About 区块在打印预览中可保留（与 Projects / Contact 一致），不强制隐藏。

#### Scenario: 打印预览
- **WHEN** 用户触发打印预览
- **THEN** About 区块 MUST 出现在打印输出中（含照片占位 / 简介 / 品牌标签）