---
applyTo: "**/*.css,tailwind.config.*"
---

# 样式与设计 Token 规则

- `src/styles/global.css` 中的 `@theme` 块是**全站设计 token 的唯一来源**。
- 新增颜色/字体/圆角/阴影时，先在 `@theme` 中定义 token，再在组件中以 Tailwind 类引用。
- 禁止在组件标记里写死颜色十六进制值。
- 保持 token 与客户画册一致：主色深蓝 `#1a3a8f` / `#0d2b6b`，占位灰 `#eef1f6`。
- 复用工具类：`.container-page`、`.card-base`、`.eyebrow`、`.wave-divider`。
