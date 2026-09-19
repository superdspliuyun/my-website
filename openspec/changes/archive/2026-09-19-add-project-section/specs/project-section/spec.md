# Spec Delta

## Purpose

为个人品牌站提供可替换数据驱动的项目作品展示区，让访客在 Hero 首屏之后快速浏览至少四个项目的视觉截图、名称、简介和 Github 入口。

## ADDED Requirements

### Requirement: Project card gallery

系统 SHALL 在 Hero Section 下方提供带有稳定 `id="projects"` 的项目展示区，至少渲染 4 张项目卡片。每张卡片 SHALL 展示项目截图、项目名称、项目简介和指向对应 Github 仓库的链接；项目内容 SHALL 来自可替换的静态示例数据。

#### Scenario: Four project cards are visible

- **GIVEN** 用户打开个人品牌站首页并向下浏览
- **WHEN** Hero Section 完成后显示项目展示区
- **THEN** 用户至少看到 4 张项目卡片，且每张卡片都包含截图、名称、简介和 Github 链接

#### Scenario: Project data is replaceable

- **GIVEN** 维护者需要替换示例项目
- **WHEN** 维护者更新项目静态数据
- **THEN** 卡片内容随数据更新，无需修改卡片布局或新增页面路由

### Requirement: Project card responsive and accessible layout

系统 SHALL 使用响应式卡片布局适配桌面和窄屏，项目截图 SHALL 使用非首屏图片的 lazy loading；每张卡片和 Github 链接 SHALL 具备可读的文本语义和键盘焦点状态，且不得造成页面水平滚动。

#### Scenario: Cards adapt to a narrow viewport

- **GIVEN** 用户使用窄屏移动设备访问项目展示区
- **WHEN** 可视区域宽度不足以容纳多列卡片
- **THEN** 卡片自动调整为单列或可读的窄列布局，截图和文字不溢出，页面不产生水平滚动

#### Scenario: Screenshot cannot be loaded

- **GIVEN** 某个项目截图资源不存在或加载失败
- **WHEN** 项目卡片渲染
- **THEN** 项目名称、简介和 Github 链接仍保持可见和可操作，页面不抛出运行时错误

### Requirement: Project card hover effect

系统 SHALL 在支持鼠标悬浮的设备上为项目卡片提供轻量视觉特效，例如阴影或有限的位移/缩放；该特效 SHALL 不改变卡片内容和链接可操作性，并在用户偏好 reduced-motion 时禁用非必要运动。

#### Scenario: User hovers a project card

- **GIVEN** 用户使用鼠标指针悬浮在项目卡片上
- **WHEN** 卡片进入 hover 状态
- **THEN** 卡片显示轻量视觉反馈，截图、文字和 Github 链接仍清晰可读

#### Scenario: User prefers reduced motion

- **GIVEN** 浏览器启用了 `prefers-reduced-motion: reduce`
- **WHEN** 用户悬浮项目卡片
- **THEN** 卡片不执行持续或明显的位移动画，但内容和链接仍可用
