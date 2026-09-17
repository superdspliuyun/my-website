## Purpose

为个人品牌站首页提供首屏 Hero 区块，向访客传达身份与价值主张，并提供"明亮/暗黑模式切换"作为全站主题基线。

## ADDED Requirements

### Requirement: Hero 内容展示

系统 MUST 在首页首屏以全屏高度（不小于视口可用高度）展示一个居中的 Hero 区块，包含且仅包含以下三类内容，按从上到下顺序排列：姓名（最高层级标题）、职业（一行文字）、一句话自我介绍（一段说明）。

#### Scenario: 首屏完整呈现
- **WHEN** 访客打开网站首页
- **THEN** 视口可见区域被 Hero 区块占满
- **AND** 姓名、职业、自我介绍均居中可见

#### Scenario: 文案来源单一
- **WHEN** 维护者修改姓名 / 职业 / 自我介绍 / CTA 文案
- **THEN** 仅需修改一处配置即可在 Hero 中生效，无需改动组件代码

#### Scenario: 文案缺失兜底
- **WHEN** 任一文案字段为空或仅包含空白字符
- **THEN** 缺失字段 MUST NOT 渲染空 DOM 占位（避免留下不可见空白行），其余字段仍正常渲染

### Requirement: Hero CTA 跳转项目

Hero MUST 包含一个 CTA 按钮（文案"查看项目"），点击后 MUST 跳转至站内锚点 `#projects`。

#### Scenario: 点击 CTA
- **WHEN** 访客点击 CTA 按钮
- **THEN** 页面跳转至 `#projects` 锚点（若该锚点暂不存在，浏览器地址栏 `#projects` 已更新，无报错）

#### Scenario: 键盘激活
- **WHEN** CTA 按钮获得焦点，访客按下 `Enter` 或 `Space`
- **THEN** 行为等同点击（跳转至 `#projects`）

#### Scenario: CTA 在打印态隐藏
- **WHEN** 用户触发打印预览（`window.matchMedia('print').matches` 为 true）
- **THEN** CTA 按钮 MUST NOT 出现在打印输出中（节省墨水并保持版面干净）

### Requirement: Hero 视觉背景

Hero MUST 由"CSS 渐变色底层 + Canvas 粒子叠加层"组合而成，整体呈现科技感。

#### Scenario: 渐变底层始终渲染
- **WHEN** 任意主题下、任意视口尺寸打开首页
- **THEN** Hero 区域 MUST 展示非纯色的渐变背景

#### Scenario: 粒子层在主流环境启动
- **WHEN** 浏览器支持 Canvas 2D 上下文且未启用"减少动效"
- **THEN** 粒子层 MUST 启动并持续渲染动画

#### Scenario: 减少动效时跳过动画
- **WHEN** 用户系统设置了 `prefers-reduced-motion: reduce`
- **THEN** 粒子层 MUST NOT 启动 RAF 动画循环，仅保留渐变底层

#### Scenario: 打印时隐藏粒子
- **WHEN** 打印预览状态
- **THEN** Canvas 粒子层 MUST NOT 被打印

### Requirement: 明亮/暗黑模式切换

Hero MUST 在右上角提供切换按钮，允许访客在"明亮"与"暗黑"模式间切换；切换结果 MUST 持久化到 `localStorage`，并在后续访问时立即生效，不出现"先按系统默认显示再切换"的主题闪烁。

#### Scenario: 默认跟随系统
- **WHEN** 首次访问且 `localStorage` 中无主题偏好
- **THEN** 系统 MUST 根据 `prefers-color-scheme` 选择初始主题（dark 系统 → 暗黑；light 系统 → 明亮）

#### Scenario: 手动切换覆盖系统
- **WHEN** 访客点击切换按钮
- **THEN** 当前主题立即切换（明亮 ↔ 暗黑）
- **AND** 切换结果写入 `localStorage`

#### Scenario: 刷新后保留偏好
- **WHEN** 访客在切换后刷新页面或重新打开网站
- **THEN** 系统 MUST 在 React 渲染前应用已持久化的主题偏好（MUST NOT 出现"先按系统默认显示一帧再切换"的视觉闪烁）

#### Scenario: 用户偏好高于系统变更
- **WHEN** `localStorage` 中已存在主题偏好
- **THEN** 后续即使系统 `prefers-color-scheme` 改变，MUST NOT 覆盖用户偏好

#### Scenario: 切换按钮可访问
- **WHEN** 切换按钮通过键盘 Tab 获得焦点
- **THEN** 按钮 MUST 显示清晰的 `:focus-visible` 焦点环
- **AND** `aria-label` 反映当前可执行的操作（明亮模式下提示"切换到暗黑"，暗黑模式下提示"切换到明亮"）
- **AND** `aria-pressed` 反映当前主题状态（暗黑为 `true`，明亮为 `false`）

#### Scenario: 局部存储异常兜底
- **WHEN** `localStorage` 不可用（隐私模式 / 配额耗尽 / SecurityError）
- **THEN** 系统 MUST 仍能完成主题切换（仅不持久化），且 MUST NOT 抛出未捕获异常

### Requirement: 主题与粒子协同

粒子颜色 MUST 随当前主题调整，确保两种模式下粒子相对背景均保持可见对比度。

#### Scenario: 暗黑模式粒子配色
- **WHEN** 当前主题为暗黑
- **THEN** 粒子 MUST 使用浅色系（不透明度足够与暗色背景区分）

#### Scenario: 明亮模式粒子配色
- **WHEN** 当前主题为明亮
- **THEN** 粒子 MUST 使用深色或低饱和色系（不与白色背景融合）

#### Scenario: 切换时无视觉错位
- **WHEN** 主题切换发生
- **THEN** 粒子配色在下一帧内更新到位（MUST NOT 出现粒子消失或与背景同色超过一帧）

### Requirement: 响应式与首屏性能

Hero MUST 在移动端（视口宽度 < 640px）下保持可用，且 MUST 不引入使首屏加载超过 2 秒的工作。

#### Scenario: 移动端全屏高度
- **WHEN** 移动端浏览器访问（地址栏弹出/收起会改变视口高度）
- **THEN** Hero 区域 MUST 始终至少占满当前可见视口高度，不出现下方的空白带或滚动条跳动

#### Scenario: 性能预算
- **WHEN** 在主流网络（Fast 3G 模拟）与中端设备配置下打开首页
- **THEN** 首屏可交互时间 MUST < 2 秒
- **AND** 粒子层 MUST NOT 阻塞首屏文本渲染（粒子降级为可选图层）

#### Scenario: 大屏不被拉空
- **WHEN** 视口宽度 ≥ 1920px
- **THEN** 居中内容 MUST 设置最大宽度（不沿用两端对齐），保持视觉重心
