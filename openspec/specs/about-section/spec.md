# About Section Specification

## Purpose

为个人品牌站提供表达个人气质与品牌记忆点的关于我区域，让访客在项目内容之后通过云彩视觉、简介和品牌标签快速了解站点主人的个人形象。

## Requirements

### Requirement: About section content

系统 SHALL 在项目展示区之后、联系我区域之前提供带有稳定 `id="about"` 的关于我 Section。Section SHALL 展示一张云彩照片、个人简介“自由、洒脱、奔放”和品牌标签“云卷云舒”，并为照片提供有意义的替代文本。

#### Scenario: About content is visible after projects

- **GIVEN** 用户从首页向下浏览
- **WHEN** 用户经过项目展示区
- **THEN** 用户可以看到云彩照片、个人简介和“云卷云舒”品牌标签

#### Scenario: About section preserves content hierarchy

- **GIVEN** 用户使用键盘或辅助技术浏览页面
- **WHEN** 关于我 Section 渲染
- **THEN** Section 有可访问标题，简介和品牌标签按清晰的阅读顺序呈现

### Requirement: About section responsive and theme-aware layout

系统 SHALL 提供左右分栏的桌面布局，并在窄屏时调整为单列布局；照片和文字 SHALL 适配亮色与暗色主题，内容不得产生水平滚动。照片作为非首屏资源 SHALL 使用 lazy loading。

#### Scenario: About layout adapts to a narrow viewport

- **GIVEN** 用户使用移动设备访问关于我区域
- **WHEN** 可视区域不足以容纳左右分栏
- **THEN** 照片、简介和品牌标签按单列顺序显示，文本可读且页面不产生水平滚动

#### Scenario: Cloud image fails to load

- **GIVEN** 云彩照片资源无法加载
- **WHEN** 关于我 Section 渲染
- **THEN** 简介、品牌标签和照片替代文本区域仍保持可用，页面不抛出运行时错误

### Requirement: Cloud image source is replaceable

系统 SHALL 将云彩照片作为可替换的本地静态资源，并记录其公开图片来源信息；替换照片不得要求修改关于我 Section 的布局或新增 API。

#### Scenario: Maintainer replaces the image

- **GIVEN** 维护者拥有新的云彩照片
- **WHEN** 维护者替换本地图片资源或其引用
- **THEN** 关于我 Section 使用新照片，其他文字内容和布局保持不变
