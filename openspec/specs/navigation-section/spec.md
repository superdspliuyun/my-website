# navigation-section Specification

## Purpose

为个人品牌站首页提供顶部固定导航栏，集中展示品牌名与区块跳转入口，作为访客在任意滚动位置返回或切换区块的统一入口。

## Requirements

### Requirement: 导航栏固定展示

首页 MUST 在最外层、Hero 区块之前渲染一个顶部固定导航栏。导航栏 MUST 始终位于视口顶部，不会随页面滚动离开视口；导航栏 MUST 不遮挡其下方区块的关键交互入口（CTA、卡片链接、主题切换按钮的可点击区域）。

#### Scenario: 滚动中始终可见
- **WHEN** 访客在首页任意滚动位置（包括向下滚动至 Projects / Contact 区域）
- **THEN** 导航栏 MUST 仍位于视口顶部且保持可交互
- **AND** 导航栏 MUST NOT 遮挡下方区块文本的可读性（半透明 + 模糊背景允许下方内容透过但不失焦）

#### Scenario: 与 Hero 主题切换按钮共存
- **WHEN** 访客在 Hero 区域时
- **THEN** Hero 右上角已有的主题切换按钮 MUST 保持原有可点击区域
- **AND** 导航栏与该按钮 MUST NOT 在视觉或层级上互相遮挡（z-index / 布局均需协调）

### Requirement: 品牌名展示

导航栏左侧 MUST 展示 `profile.name` 字段，作为品牌名 / 个人 logo 替代。该区域 MUST 同时是一个指向 Hero 区块顶部锚点（`#hero`）的链接，访客点击品牌名等同于点击"首页"链接。

#### Scenario: 品牌名显示与跳转
- **WHEN** 维护者在 `src/data/profile.ts` 中更新 `profile.name`
- **THEN** 导航栏左侧 MUST 同步显示新值，无需改动组件代码
- **AND** 点击品牌名 MUST 跳转至 `#hero`（Hero 区块顶部）

#### Scenario: 品牌名为空
- **WHEN** `profile.name` 为空字符串或仅含空白字符
- **THEN** 导航栏左侧 MUST 显示占位文案"[品牌名]"
- **AND** 左侧仍 MUST 作为可点击链接指向 `#hero`

### Requirement: 区块跳转链接

导航栏右侧 MUST 展示且仅展示三个站内锚点链接，按从左到右顺序为：首页（`#hero`）、项目（`#projects`）、联系我（`#contact`）。每个链接 MUST 可点击，且 MUST 跳转至对应的站内锚点。

#### Scenario: 三个链接固定存在
- **WHEN** 访客打开首页
- **THEN** 导航栏右侧 MUST 包含且仅包含三个链接：首页、项目、联系我
- **AND** 三个链接 MUST 按此固定顺序排列（不允许维护者通过配置改动顺序，避免布局漂移）

#### Scenario: 点击跳转至锚点
- **WHEN** 访客点击任一链接
- **THEN** 页面 MUST 平滑滚动至对应锚点（`#hero` / `#projects` / `#contact`），目标区块 MUST 进入视口
- **AND** 浏览器地址栏的 URL 片段 MUST 同步更新为对应锚点

#### Scenario: 链接文案可配置
- **WHEN** 维护者修改链接文案（`profile.navLabels.home` / `projects` / `contact`）
- **THEN** 导航栏 MUST 同步显示新文案，无需改动组件代码

#### Scenario: 锚点目标不存在
- **WHEN** 维护者未提供对应锚点（如 Contact 区块未渲染）
- **THEN** 该链接 MUST 仍作为 `<a>` 元素存在
- **AND** 点击后浏览器原生行为 MUST 生效（跳转至页面顶部或无定位），但 MUST NOT 抛出未捕获异常

### Requirement: 平滑滚动

点击导航链接触发的锚点跳转 MUST 使用平滑滚动动画。系统 MUST 尊重用户的"减少动效"系统偏好：当 `prefers-reduced-motion: reduce` 为 true 时，滚动 MUST 退化为瞬时跳转（MUST NOT 触发动画）。

#### Scenario: 默认平滑滚动
- **WHEN** 访客点击任一导航链接且系统未设置"减少动效"
- **THEN** 浏览器 MUST 以平滑滚动动画移动至目标锚点（典型时长 300–800ms）

#### Scenario: 减少动效时即时跳转
- **WHEN** 访客系统设置 `prefers-reduced-motion: reduce` 为 true
- **THEN** 点击导航链接 MUST 立即跳转至目标锚点，无平滑动画
- **AND** 系统 MUST NOT 通过脚本强制启用平滑滚动覆盖用户偏好

### Requirement: 模糊背景

导航栏背景 MUST 使用半透明 + 背景模糊（`backdrop-filter` / `backdrop-blur` 工具类等价效果），使下方滚动内容透过导航栏仍可隐约可见但不抢焦点。模糊效果 MUST 在明亮与暗黑两种主题下均生效。

#### Scenario: 两种主题下均模糊
- **WHEN** 任意主题（明亮或暗黑）下查看首页
- **THEN** 导航栏背景 MUST 显示为半透明 + 模糊效果
- **AND** 文字与链接 MUST 与背景层保持可读对比度

#### Scenario: 不支持 backdrop-filter 的浏览器
- **WHEN** 浏览器不支持 `backdrop-filter`
- **THEN** 导航栏 MUST 退化为更高的不透明度（如 `bg-background/95`）以保持可读性，而非完全透明

### Requirement: 主题适配

导航栏 MUST 复用全站主题基础设施（`<html class="dark">` + `@theme` token），在明亮与暗黑模式下均保持文字可读、链接可视、焦点环清晰。

#### Scenario: 暗黑模式配色
- **WHEN** 当前主题为暗黑
- **THEN** 导航栏背景 MUST 使用暗色 token（如 `bg-background` 系），文字与链接 MUST 使用前景色 token

#### Scenario: 明亮模式配色
- **WHEN** 当前主题为明亮
- **THEN** 导航栏背景 MUST 使用亮色 token，文字与链接 MUST 使用前景色 token
- **AND** hover/focus 状态 MUST 在两种主题下均可见

#### Scenario: 切换主题无闪烁
- **WHEN** 访客切换主题
- **THEN** 导航栏配色 MUST 在下一帧内更新到位（MUST NOT 出现"先按旧主题渲染一帧再切换"的闪烁）

### Requirement: 可访问性

导航栏 MUST 支持完整的键盘操作（Tab 顺序合理、Enter 触发跳转、Shift+Tab 反向），所有交互元素 MUST 暴露无障碍语义。

#### Scenario: 键盘 Tab 顺序
- **WHEN** 访客通过键盘 Tab 浏览页面
- **THEN** 导航栏内的可聚焦元素 MUST 按"品牌名 → 三个链接"顺序进入 Tab 序列
- **AND** 每个元素获得焦点时 MUST 显示清晰的 `:focus-visible` 焦点环

#### Scenario: 链接语义
- **WHEN** 任意自动化辅助技术（屏幕阅读器）扫描导航栏
- **THEN** 导航容器 MUST 暴露 `role="navigation"`（或等价的 `<nav>` 元素语义）
- **AND** 导航 MUST 带有 `aria-label="主导航"` 标识

#### Scenario: 跳转后焦点管理
- **WHEN** 访客点击导航链接触发跳转
- **THEN** 浏览器 MUST 按默认行为更新焦点（通常跳转至目标元素或保持当前焦点）
- **AND** 系统 MUST NOT 强制移除焦点或劫持 Tab 序列

### Requirement: 响应式布局

导航栏 MUST 在桌面端（视口宽度 ≥ 640px）与移动端（视口宽度 < 640px）下均保持可用与可读。

#### Scenario: 移动端不溢出
- **WHEN** 视口宽度 < 640px
- **THEN** 导航栏 MUST 保持单行排列（MUST NOT 折行或撑出水平滚动条）
- **AND** 三个链接与品牌名 MUST 在小屏下仍可点击且不互相重叠

#### Scenario: 桌面端居中布局
- **WHEN** 视口宽度 ≥ 640px
- **THEN** 导航栏内容（品牌名 + 链接组） MUST 居中且设置最大宽度（与 Hero / Projects 一致的 `max-w-5xl` 或同等约束），保持视觉重心

#### Scenario: 大屏不被拉空
- **WHEN** 视口宽度 ≥ 1920px
- **THEN** 导航栏 MUST 设置最大宽度并居中（不沿用两端对齐）

### Requirement: 打印态隐藏

导航栏 MUST 在打印预览状态下隐藏，避免在打印输出中占用首行版面。

#### Scenario: 打印预览
- **WHEN** 用户触发打印预览（`window.matchMedia('print').matches` 为 true）
- **THEN** 导航栏 MUST NOT 出现在打印输出中