---
applyTo: "src/components/**,src/pages/**,src/layouts/**"
---

# 组件与页面规则

- 所有文案 props 使用 `LocalizedText`（`{ en, zh }`），从 `src/content/*.json` 读取，禁止在标记中硬编码中文或英文文案。
- 组件需同时渲染中英文。英文用 `font-display`（标题）或正文字体，中文为辅助行/并列。
- 复用 `src/components/` 既有组件，不要为单个页面复制粘贴一次性卡片结构。
- 颜色只用 Tailwind token 类（`brand-*`、`accent`、`ink`、`muted`、`line`、`placeholder`），禁止写死十六进制。
- 卡片用 `.card-base`，页面容器用 `.container-page`，小标题用 `.eyebrow`。
- 内部链接与资源用 `url()`（来自 `src/lib/i18n.ts`）以兼容 GitHub Pages 的 base path。
- 图片一律通过 `PhotoPlaceholder` 占位，并提供 `LocalizedText` 的 `alt`。
