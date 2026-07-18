# 禾安鑫官网 · Heanxin Website

东莞市禾安鑫五金塑胶制品有限公司（Dongguan Heanxin Hardware & Plastic Products Co., Ltd.）企业官网。

这是一个面向全球 OEM / ODM 客户的中英双语静态站，展示塑胶注塑、模具开发、嵌件注塑、五金塑胶组合件、材料工艺与定制制造能力。

- 线上地址：[https://fangxun911.github.io/heanxin-website/](https://fangxun911.github.io/heanxin-website/)
- 部署方式：GitHub Pages 项目页，基础路径为 `/heanxin-website`
- 当前架构：Astro + Tailwind CSS v4 + TypeScript，纯静态输出

## 主要能力

- 中英双语切换，同一时间只显示一种语言；用户选择保存在 `localStorage`，跨页面切换保持一致。
- 适配手机、平板、桌面和超宽屏；正文与视觉区域分别使用可读宽度和宽屏容器。
- 首页、产品目录、能力流程、材料工艺、行业矩阵、新闻与报价联系等完整业务页面。
- 产品目录支持分类切换、图片预览、画廊导航、键盘操作和按需加载。
- 图片通过 Astro Assets 生成响应式 `srcset`、AVIF 和 WebP，并检查首屏优先级与产物体积。
- 原生 CSS 与少量 JavaScript 以渐进增强方式提供页面过渡、进入视口动效、流程动画、轮播和轻视差。
- 完整支持 `prefers-reduced-motion`，无 JavaScript 时正文仍默认可见。
- SEO 包含页面 meta、canonical、Open Graph、sitemap 以及 Organization / WebSite JSON-LD。
- 字体与静态资源本地托管，不依赖外部字体服务。

## 页面路由

| 路由                   | 内容                                         |
| ---------------------- | -------------------------------------------- |
| `/`                    | 首页、核心方案、能力数据与报价入口           |
| `/about`               | 公司介绍、车间与企业优势                     |
| `/products`            | 七类产品目录与交互式产品浏览器               |
| `/capabilities`        | 注塑、模具、嵌件、组装、OEM / ODM 与质量能力 |
| `/materials-processes` | 材料库、表面工艺与选型建议                   |
| `/industries`          | 主要应用行业                                 |
| `/news`                | 新闻搜索、文章列表与静态文章详情             |
| `/contact`             | 联系方式、项目资料清单与报价入口             |

兼容路由 `/services`、`/mold-capability` 复用制造能力页面并指向 `/capabilities` canonical；`/showcase` 保留产品展示入口并指向 `/products` canonical。站点同时生成新闻详情页和 `404.html`。

## 本地开发

建议使用 Node.js 22 和 npm。首次拉取或依赖锁文件更新后安装依赖：

```bash
npm ci
```

常用命令：

```bash
npm run dev           # 本地开发：http://localhost:4321/heanxin-website/
npm run build         # 构建到 dist/，并自动运行图片性能检查
npm run preview       # 本地预览生产构建
npm run test:content  # 检查页面、双语内容、组件契约与关键响应式规则
npm run test:images   # 检查已有 dist/ 中的响应式图片产物
npm run format        # 使用 Prettier 格式化
npm run format:check  # 检查格式，不修改文件
```

提交前建议执行：

```bash
npm run format:check
npm run test:content
npm run build
git diff --check
```

`npm run test:images` 直接读取 `dist/`，单独运行前应先执行一次 `npm run build`。

## 目录结构

```text
src/
├─ assets/images/     由 Astro 处理的产品与 banner 原图
├─ components/        Hero、产品浏览器、卡片、流程、页眉页脚等复用组件
├─ content/           中英双语内容与媒体元数据 JSON
├─ layouts/           BaseLayout 页面骨架、SEO、导航与全局增强脚本
├─ lib/               GitHub Pages URL 与响应式图片辅助函数
├─ pages/             页面路由、新闻详情页与 404
└─ styles/            全局设计 token、布局工具和动效契约
public/                favicon、OG 图片和 robots.txt
scripts/               内容结构、语言持久化与图片性能检查
.github/workflows/     GitHub Pages 自动部署工作流
```

## 内容与设计约定

- 文案统一放在 `src/content/*.json`，双语字段使用 `{ "en": "...", "zh": "..." }`。
- 页面使用 `T` 组件或带 `lang` 属性的节点渲染双语内容，由 `html[data-lang]` 控制显示语言。
- 公司名称、联系方式、导航和页脚信息统一维护在 `src/content/site.json`。
- 产品图片放入 `src/assets/images/products/`，并在 `src/content/media.json` 中登记路径、尺寸和双语 `alt`。
- 页面图片优先复用 `ResponsiveImage` 或 Astro `Picture`；缺少真实图片时使用 `PhotoPlaceholder` 并提供双语说明。
- 内部链接和资源路径统一通过 `src/lib/i18n.ts` 的 `url()` 生成，避免 GitHub Pages 基础路径失效。
- 颜色、字体、圆角和阴影只在 `src/styles/global.css` 的设计 token 中维护。
- 标题使用 Outfit，正文使用 Work Sans；中文使用系统字体回退栈（包含 Noto Sans SC）。
- `.container-page` 用于正文和常规章节，最大宽度 `96rem`；`.container-wide` 用于 Header、Footer、Hero 和产品舞台，最大宽度 `112rem`。
- 页面水平边距按断点使用 20 / 32 / 48 / 64px，正文建议限制在 `72ch`，标题建议限制在 `18ch`。

## 部署

推送到 `main` 后，[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 会自动：

1. 使用 Node.js 22 安装锁定依赖。
2. 执行 `npm run build` 生成静态文件并完成图片检查。
3. 上传 `dist/` 并发布到 GitHub Pages。

仓库的 **Settings → Pages → Build and deployment → Source** 必须设置为 **GitHub Actions**。Astro 配置中的 `site` 和 `base` 必须继续与当前 GitHub Pages 地址及仓库名一致。
