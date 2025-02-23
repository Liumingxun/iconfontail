# Iconfontail

Iconfontail is a powerful and easy-to-use tool for managing and using icon fonts with tailwindcss in your web projects.

## Features

- Simple integration with your web projects
- Support for multiple icon font libraries
- Easy customization of icons
- Lightweight and fast

## Installation

|           npm           |           pnpm           |           yarn           |
|:-----------------------:|:------------------------:|:------------------------:|
| npm install iconfontail | pnpm install iconfontail | yarn install iconfontail |

## Usage

If you are using [iconfont](https://www.iconfont.cn/) as your icon source:

- You can download your icon zip file, and after unzipping it, you will see the `iconfont.js` file
- Place this file in your project
- Import this plugin in the tailwind configuration file, passing in the relative path of `iconfont.js`
- Use it where you need it, without worrying about the file size

```ts
export default {
  // ……
  plugins: [
    iconfontail({
      source: './iconfont.js', // hard to parse, using `regexp` to extract
    }),
  ],
  // ……
}
```

Or you can pass a Record directly as the source parameter for a JSON-like file:

- such as [icones](https://icones.js.org/), you can pick some icons add to your bag
- and then you click `Download Zip`, choose `JSON`:

```ts
import icones from './icones-bags.json'

export default {
  // ……
  plugins: [
    iconfontail({
      source: icones.reduce((acc, { name, svg }) => {
        acc[name] = svg
        return acc
      }, {}),
    }),
  ],
  // ……
}
```

above situation see [example](https://github.com/Liumingxun/iconfontail/blob/main/example/tailwind.config.js)

Or if you are using the others with a non-JSON-like file:

- Copy the file that contains all SVG resources into your project
- Import this plugin in the tailwind configuration file, passing in the relative path of that file
- Pass an extract function as the plugin parameter, which should return a record of icon names and their content

  **Notice**: the icon content should start with the `<svg>` root element that includes the `viewBox` attribute.  

- That's all! You can use it as needed!

## Contributing

We welcome contributions! We're excited that you're interested in contributing to this project! Please feel free to open an issue or submit a pull request.

## Inspire and Thanks

[Icons in Pure CSS - antfu](https://antfu.me/posts/icons-in-pure-css)

## License

[MIT LICENSE](LICENSE)