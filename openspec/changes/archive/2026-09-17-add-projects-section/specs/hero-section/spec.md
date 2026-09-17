## MODIFIED Requirements

### Requirement: Hero CTA 跳转项目

Hero MUST 包含一个 CTA 按钮（文案"查看项目"），点击后 MUST 跳转至站内锚点 `#projects` 并显示 Projects 区块。

#### Scenario: 点击 CTA
- **WHEN** 访客点击 CTA 按钮
- **THEN** 页面跳转至 `#projects` 锚点，Projects 区块 MUST 进入视口（浏览器原生平滑滚动或跳转定位均可）

#### Scenario: 键盘激活
- **WHEN** CTA 按钮获得焦点，访客按下 `Enter` 或 `Space`
- **THEN** 行为等同点击（跳转至 `#projects`）

#### Scenario: CTA 在打印态隐藏
- **WHEN** 用户触发打印预览（`window.matchMedia('print').matches` 为 true）
- **THEN** CTA 按钮 MUST NOT 出现在打印输出中（节省墨水并保持版面干净）
