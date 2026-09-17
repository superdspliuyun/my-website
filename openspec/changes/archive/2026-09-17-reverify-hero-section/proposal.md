## Why

`add-hero-section`（已于 2026-09-16 归档，8 个 Phase 全勾选）的 tasks.md 中第 8 节"端到端验证"勾选项代表"维护者在浏览器中手动验证通过"，但缺乏可独立复核的客观证据（构建产物日志、DevTools 取色记录、控制台无 error/warn 的截图、Performance 录制数据等）。归档后该 tasks.md 已被冻结无法回写补证，因此另立本变更、把实测证据以新归档形式正式留痕——后续维护者或审计可据此独立核验 Hero 行为是否符合 `hero-section` spec。

## What Changes

- 新增 `reverify-hero-section` 变更：在当前已交付代码（无任何源码改动）的基础上，重新执行 `openspec/changes/archive/2026-09-16-add-hero-section/tasks.md` 第 8 节（8.1 桌面端完整路径、8.2 移动端模拟、8.3 构建 + 预览）列出的验证步骤。
- 在新 `tasks.md` 中把验证步骤拆分为可勾选的 Phase（桌面端路径 / 移动端模拟 / 构建与预览 / 取色对比度），每个 checkbox 配套一行证据占位（构建日志摘要、截图文件名、Performance 数值、控制台截图文件名等），由维护者在执行时填入。
- 归档后，本变更作为 Hero 行为已通过客观验证的正式记录，与 `2026-09-16-add-hero-section` 归档共存——前者是"代码已落地"，后者是"行为已实测"。

## Capabilities

### New Capabilities

无。本变更不引入任何新的能力定义；只对既有 `hero-section` 行为做"事后验证留痕"，不增不减 spec 级需求。

### Modified Capabilities

无。`hero-section` spec 的 REQUIREMENTS 保持不变；本变更不修改 `openspec/specs/hero-section/spec.md`。

（注解：本变更的 `.openspec.yaml` 已设置 `skip_specs: true`，对应"零 capability delta 的纯验证/留痕类变更"。）

## Impact

- **源码改动**：无。`src/` 下任何文件都不会被修改。
- **依赖**：无新增 / 无变更。
- **spec 改动**：无（`skip_specs: true`）。
- **配置改动**：无。
- **部署**：无；本变更本身不影响线上行为，仅补一份验证记录归档。
- **OpenSpec 影响**：
  - 在 `openspec/changes/` 下新增 `reverify-hero-section/`（本次 propose）。
  - 归档后会落到 `openspec/changes/archive/<日期>-reverify-hero-section/`；与 `2026-09-16-add-hero-section` 并列保存。
  - 不动现有归档、不动 `openspec/specs/hero-section/spec.md`。
- **对现有功能的影响**：零。维护者按 tasks.md 跑验证时仅需打开浏览器与 DevTools，不触动产品行为。
- **人力成本**：执行一次约 20–30 分钟（桌面端 + 移动端 + 一次 build/preview）。
