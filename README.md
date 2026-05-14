# iconfontail

将 [iconfont.cn](https://iconfont.cn) 图标集成到 Tailwind CSS v4 中，借助 Tree Shaking 自动优化图标体积。

## 安装

|           npm           |           pnpm           |           bun           |
| :---------------------: | :----------------------: | :---------------------: |
| npm install iconfontail | pnpm install iconfontail | bun install iconfontail |

> **同等依赖**：需要 Tailwind CSS v4

## 使用

### 1. 下载 iconfont 资源

从 [iconfont.cn](https://iconfont.cn) 项目页面**下载至本地**，解压后将生成的 `iconfont.js` 和 `iconfont.css` 放入项目中。

### 2. 配置 Tailwind CSS v4

在 Tailwind CSS 入口文件中引入插件：

```css
@import 'tailwindcss';
@plugin 'iconfontail' {
  /* 路径相对项目根目录 */
  iconfontjs: iconfont.js;
  iconfontcss: iconfont.css;
}

@font-face {
  font-family: 'iconfont';
  src:
    url('/iconfont.woff2?t=1778462439025') format('woff2'),
    url('/iconfont.woff?t=1778462439025') format('woff'),
    url('/iconfont.ttf?t=1778462439025') format('truetype');
}
```

### 3. 在 HTML 中使用

```html
<!-- color 模式：显示原始 SVG 定义的颜色 -->
<i class="icon-home color"></i>

<!-- font 模式：使用 Unicode 渲染 -->
<i class="icon-home font"></i>
```

> 使用字体模式时，需确保页面已加载 iconfont 的字体文件（在 `global.css` 中已通过 `@font-face` 引入）。

## FAQ

- 怎么修改图标大小？

  使用任意可以修改 `font-size` 的方法，如 tailwind 的 `text-3xl`。

- 怎么修改图标颜色？

  color 模式下如果原始 svg 定义了颜色，则不支持修改颜色；如果原始 svg 使用 currentColor 作为填充色，则可以使用任意可以修改 `color` 的方法，如 tailwind 的 `text-blue-500`。

## 工作原理

iconfontail 是一个 Tailwind CSS v4 插件，它会：

1. 读取 iconfont.cn 生成的 JS 文件（Symbol）和 CSS 文件（Unicode）
2. 解析 JS 中的 `<symbol>` 标签提取 SVG 图标，解析 CSS 中的 Unicode 映射
3. 为每个图标生成两类工具类：
   - **`.iconName.color`** — 将 SVG 内联为 `mask-image` 或 `background-image`
   - **`.iconName.font::before`** — 使用 Unicode + `font-family: iconfont` 的字体图标方式

由于生成的类名通过 Tailwind 工具类注册，未使用的图标会在构建时被 Tree Shaking 移除。

## License

[MIT](./LICENSE)
