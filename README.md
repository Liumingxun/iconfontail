# iconfontail

iconfontail 是一个将 [iconfont.cn](https://iconfont.cn) 图标集成到 Tailwind CSS v4 的插件，支持 Tree Shaking 自动优化图标体积。

## 特性

- 简单集成：轻松将 iconfont 图标库与 Tailwind CSS 项目结合。
- 多种模式：支持 SVG 和字体图标两种渲染模式。
- 高效优化：未使用的图标类会在构建时自动移除，减少最终产物体积。
- 灵活定制：支持自定义图标大小、颜色等样式。

## 安装

> **依赖要求**：需要 Tailwind CSS v4

|           npm           |           pnpm           |           bun           |
| :---------------------: | :----------------------: | :---------------------: |
| npm install iconfontail | pnpm install iconfontail | bun install iconfontail |

## 快速开始

### 1. 下载 iconfont 资源

从 [iconfont.cn](https://iconfont.cn) 项目页面**下载至本地**，解压后将 `iconfont.js` 和 `iconfont.json` 以及相应的字体文件放入项目中。

### 2. 配置 Tailwind CSS v4

在 Tailwind CSS 入口文件中引入插件：

```css
@import 'tailwindcss';
@plugin 'iconfontail' {
  /* 路径相对项目根目录 */
  iconfontjs: iconfont.js;
  iconfontjson: iconfont.json;
}

@font-face {
  /* font-family 应该与 iconfont.json 中相同 */
  font-family: 'iconfont';
  src:
    url('/iconfont.woff2?t=1778462439025') format('woff2'),
    url('/iconfont.woff?t=1778462439025') format('woff'),
    url('/iconfont.ttf?t=1778462439025') format('truetype');
}
```

### 3. 在 HTML 中使用

规则：

- 图标前缀由 `css_prefix_text` 定义
- 图标名称由 `$.glyphs[*].font_class` 定义

```html
<!-- color 模式：显示原始 SVG 定义的颜色 -->
<i class="icon-home color"></i>

<!-- font 模式：使用 Unicode 渲染 -->
<i class="icon-home font"></i>
```

> [!IMPORTANT]  
> 使用字体模式时，需确保页面已加载 iconfont 的字体文件

## 常见问题

### 如何修改图标大小？

使用任意可以修改 `font-size` 的方法，例如：

```html
<i class="icon-home color text-3xl"></i>
```

### 如何修改图标颜色？

- **color 模式**：如果原始 SVG 使用 `currentColor` 作为填充色，可以通过修改 `color` 属性：

```html
<i class="icon-home color text-blue-500"></i>
```

- **font 模式**：直接修改 `color` 属性：

```html
<i class="icon-home font text-red-500"></i>
```

## 工作原理

iconfontail 通过以下步骤实现图标集成和优化：

1. **解析资源文件**：
   - 读取 `iconfont.json` 文件，解析 Unicode 映射和字体元信息。
   - 读取 `iconfont.js` 文件，提取 `<symbol>` 标签解析 SVG 图标。
   - 通过 `iconfont.json` 中的 `glyphs` 去索引 js 中 SVG 图标。

2. **生成工具类**：
   - 为每个图标生成两类工具类：
     - **`.iconName.color`**：将 SVG 图标内联为 `mask-image` 或 `background-image`，支持 `currentColor` 填充。
     - **`.iconName.font::before`**：通过伪元素 `::before` 渲染 Unicode 字符。

3. **Tree Shaking 优化**：
   - 通过 Tailwind CSS 的工具类注册机制，未使用的图标类会在构建时被自动移除，减少最终产物体积。

## Inspire and Thanks

[Icons in Pure CSS - antfu](https://antfu.me/posts/icons-in-pure-css)

## License

[MIT](./LICENSE)
