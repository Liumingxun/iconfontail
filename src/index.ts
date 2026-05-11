import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import createPlugin from 'tailwindcss/plugin'

interface Options {
  iconfontjs: string
  iconfontcss: string
}
const symbolTag = /<symbol\s[^>]*?\bid="([^"]+)"[^>]*>(.*?)<\/symbol>/gi
const unicodeTag = /\.([^:]+):before\s*\{[^}]*content:\s*"([^"]+)"/gi

function encodeSvg(svg: string) {
  return svg
    .replaceAll('"', '\'')
    .replaceAll('%', '%25')
    .replaceAll('#', '%23')
    .replaceAll('{', '%7B')
    .replaceAll('}', '%7D')
    .replaceAll('<', '%3C')
    .replaceAll('>', '%3E')
}

const plugin: (opts: Options) => any = createPlugin.withOptions<Options>((opts) => {
  if (!opts || !opts.iconfontjs || !opts.iconfontcss) {
    console.warn('Iconfont plugin requires iconfontjs and iconfontcss options!')
    console.warn('Iconfont plugin will be skipped.')
    return () => {}
  }

  const jsSource = readFileSync(resolve(opts.iconfontjs), 'utf-8')
  const cssSource = readFileSync(resolve(opts.iconfontcss), 'utf-8')

  const svgMap = new Map(Array.from(jsSource.matchAll(symbolTag), ([, name, content]) => [name, `<svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">${content}</svg>`]))
  const unicodeMap = new Map(Array.from(cssSource.matchAll(unicodeTag), ([, name, unicode]) => [name, unicode]))

  return function ({ addUtilities }) {
    const iconUtilities: Record<string, Record<string, string>> = {}
    for (const [name, svg] of svgMap) {
      const unicode = unicodeMap.get(name) ?? ''
      const uri = `url("data:image/svg+xml;utf8,${encodeSvg(svg)}")`
      const mode = svg.includes('currentColor') ? 'mask' : 'background'
      iconUtilities[`.${name}.color`] = {
        [mode]: `${uri} no-repeat center`,
        backgroundColor: mode === 'mask' ? 'currentColor' : 'transparent',
        height: '1em',
        width: '1em',
      }
      iconUtilities[`.${name}.font::before`] = {
        content: `"${unicode}"`,
        fontFamily: 'iconfont',
      }
    }
    addUtilities(iconUtilities)
  }
})

export default plugin
