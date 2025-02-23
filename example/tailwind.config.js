import iconfontail from 'iconfontail'
import icones from './icones-bags.json'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts}",
  ],
  prefix: "t-",
  theme: {
    extend: {},
  },
  plugins: [
    iconfontail({
      source: './iconfont.js',
    }),
    iconfontail({
      source: icones.reduce((acc, { name, svg }) => {
        acc[name.replace(':', '-')] = svg
        return acc
      }, {}),
    }),
  ],
}

