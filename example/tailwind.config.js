import iconfontail from 'iconfontail'

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
  plugins: [iconfontail({
    source: './iconfont.js',
  })],
}

