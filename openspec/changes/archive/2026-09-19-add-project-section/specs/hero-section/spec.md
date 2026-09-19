# Spec Delta

## MODIFIED Requirements

### Requirement: Project call to action

系统 SHALL 在 Hero Section 提供一个 CTA，目标为项目展示区域的 `#projects` 锚点；项目展示区域 SHALL 位于 Hero Section 下方，包含至少 4 个项目卡片，并保持稳定可访问的 `id`。

#### Scenario: CTA targets the project anchor

- **GIVEN** 用户位于 Hero Section
- **WHEN** 用户激活 CTA
- **THEN** 浏览器导航目标为 `#projects`，并滚动到 Hero 下方的项目展示区域

#### Scenario: CTA remains usable without pointer input

- **GIVEN** 用户通过键盘浏览页面
- **WHEN** 焦点移动到 CTA 并按下 Enter
- **THEN** CTA 被激活且导航目标为 `#projects`，项目卡片区域保持可访问
