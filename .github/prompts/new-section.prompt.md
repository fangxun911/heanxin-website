---
mode: agent
description: 按禾安鑫设计系统与组件库，生成一个新的双语页面区块（section）。
---

# 生成新页面区块

你将为禾安鑫官网生成一个新的页面区块（section）。请遵守：

1. **先读** `.github/copilot-instructions.md` 与 `src/lib/i18n.ts`，了解 token、组件与 `url()` 助手。
2. 文案放入对应的 `src/content/*.json`，每条为 `{ "en": "...", "zh": "..." }`。
3. **复用** `src/components/` 既有组件（`SectionHeader`、`IconFeatureCard`、`NumberedCard`、`ProductCard`、`ProcessStepper`、`PhotoPlaceholder`、`HighlightStat`），不要新造一次性卡片。
4. 容器用 `.container-page`，卡片用 `.card-base`，颜色只用 `brand-*` 等 token 类。
5. 区块标题统一使用 `SectionHeader`，并提供中英 `eyebrow` / `title` / `subtitle`。
6. 图片用 `PhotoPlaceholder` 并提供双语 `alt`。

请向我确认：这个区块属于哪一页、主题是什么、需要哪种布局（卡片网格 / 流程步骤 / 图文左右 / 深蓝强调段）。
