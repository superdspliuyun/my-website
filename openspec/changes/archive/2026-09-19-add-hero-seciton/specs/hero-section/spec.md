# Spec Delta

## Purpose

为个人品牌站提供首屏身份展示、项目入口和可访问的主题切换体验，同时以低干扰的科技感视觉建立站点的第一印象。

## ADDED Requirements

### Requirement: Hero identity content

系统 SHALL 在首屏提供一个占满可视区域高度且内容居中的 Hero Section，展示姓名“小飞侠”、职业“天马行空”及介绍文案“喜欢漫无边际去追逐梦的背影”。

#### Scenario: Hero content is visible on page load

- **GIVEN** 用户首次打开站点首页
- **WHEN** 页面完成初始渲染
- **THEN** 用户可以在首屏看到姓名、职业和完整介绍文案

#### Scenario: Small viewport preserves readable Hero content

- **GIVEN** 用户使用窄屏移动设备访问首页
- **WHEN** 可视区域宽度不足以容纳桌面字号
- **THEN** Hero 内容仍保持完整、居中且无需水平滚动

### Requirement: Project call to action

系统 SHALL 在 Hero Section 提供一个 CTA，目标为项目区域的 `#projects` 锚点。

#### Scenario: CTA targets the project anchor

- **GIVEN** 用户位于 Hero Section
- **WHEN** 用户激活 CTA
- **THEN** 浏览器导航目标为 `#projects`

#### Scenario: CTA remains usable without pointer input

- **GIVEN** 用户通过键盘浏览页面
- **WHEN** 焦点移动到 CTA 并按下 Enter
- **THEN** CTA 被激活且导航目标为 `#projects`

### Requirement: Theme selection

系统 SHALL 提供亮色和暗色主题切换控件，并在后续访问中恢复用户最后一次选择；没有已保存偏好时 SHALL 跟随系统主题偏好。

#### Scenario: User switches theme

- **GIVEN** 页面已加载且主题切换控件可用
- **WHEN** 用户切换到另一主题
- **THEN** 页面颜色切换为所选主题且控件反映当前状态

#### Scenario: Saved preference is restored

- **GIVEN** 用户此前已选择主题
- **WHEN** 用户再次打开站点
- **THEN** 页面恢复该用户选择的主题

#### Scenario: No saved theme preference

- **GIVEN** 浏览器中不存在已保存的主题选择
- **WHEN** 用户首次打开站点
- **THEN** 页面采用系统主题偏好

### Requirement: Technology-style background

系统 SHALL 在 Hero Section 呈现适配亮色和暗色主题的渐变背景及粒子视觉层。粒子仅可缓慢动态运动，Hero 内容、CTA 与页面滚动 SHALL 不包含动画效果。

#### Scenario: Background follows the active theme

- **GIVEN** 用户正在查看 Hero Section
- **WHEN** 用户切换主题
- **THEN** 渐变背景和粒子视觉层采用与当前主题匹配的配色，且文本与 CTA 保持可辨识

#### Scenario: Reduced-motion preference disables particle movement

- **GIVEN** 用户的系统启用了 reduced-motion 偏好
- **WHEN** Hero Section 渲染
- **THEN** 粒子视觉层可以保持静态，但不得持续运动

#### Scenario: Particle rendering is unavailable

- **GIVEN** 浏览器无法使用粒子绘制能力
- **WHEN** Hero Section 渲染
- **THEN** 姓名、职业、介绍文案、CTA 和主题切换控件仍保持可用
