## MODIFIED Requirements

### Requirement: 区块跳转链接

导航栏右侧 MUST 展示且仅展示四个站内锚点链接，按从左到右顺序为：首页（`#hero`）、关于（`#about`）、项目（`#projects`）、联系我（`#contact`）。每个链接 MUST 可点击，且 MUST 跳转至对应的站内锚点。

#### Scenario: 三个链接固定存在
- **WHEN** 访客打开首页
- **THEN** 导航栏右侧 MUST 包含且仅包含四个链接：首页、关于、项目、联系我
- **AND** 四个链接 MUST 按此固定顺序排列（不允许维护者通过配置改动顺序，避免布局漂移）

#### Scenario: 点击跳转至锚点
- **WHEN** 访客点击任一链接
- **THEN** 页面 MUST 平滑滚动至对应锚点（`#hero` / `#about` / `#projects` / `#contact`），目标区块 MUST 进入视口
- **AND** 浏览器地址栏的 URL 片段 MUST 同步更新为对应锚点

#### Scenario: 链接文案可配置
- **WHEN** 维护者修改链接文案（`profile.navLabels.home` / `about` / `projects` / `contact`）
- **THEN** 导航栏 MUST 同步显示新文案，无需改动组件代码

#### Scenario: 锚点目标不存在
- **WHEN** 维护者未提供对应锚点（如 About 区块未渲染）
- **THEN** 该链接 MUST 仍作为 `<a>` 元素存在
- **AND** 点击后浏览器原生行为 MUST 生效（跳转至页面顶部或无定位），但 MUST NOT 抛出未捕获异常

## ADDED Requirements

### Requirement: 关于链接的渲染与 a11y

About 区块作为首页新增的"关于我"区块，导航栏 MUST 在"首页"与"项目"链接之间插入 `#about` 链接。访客点击 MUST 跳转至 About 区块（`id="about"`），与既有平滑滚动 / 主题适配 / 焦点环机制一致。

#### Scenario: 关于链接新插入位置
- **WHEN** 维护者将 About 区块加入首页（在 Hero 之后、Projects 之前）
- **THEN** 导航栏 MUST 在"首页"与"项目"链接之间渲染"关于"链接
- **AND** 该链接 MUST 指向 `href="#about"`

#### Scenario: 关于链接 a11y
- **WHEN** 访客通过键盘 Tab 浏览导航栏
- **THEN** Tab 序列 MUST 含品牌名 + 4 个链接（首页 / 关于 / 项目 / 联系我），共 5 个可聚焦元素
- **AND** "关于"链接 MUST 显示清晰的 `:focus-visible` 焦点环
- **AND** 屏幕阅读器扫描 MUST 暴露正确的链接文案