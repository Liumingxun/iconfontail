import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import createPlugin from 'tailwindcss/plugin'

interface IconfontJson {
  id: string
  name: string
  font_family: string
  css_prefix_text: string
  description: string
  glyphs: Glyph[]
}

interface Glyph {
  icon_id: string
  name: string
  font_class: string
  unicode: string
  unicode_decimal: number
}

interface Options {
  iconfontjs: string
  iconfontjson: string
}
const symbolTag = /<symbol\s[^>]*?\bid="([^"]+)"[^>]*>(.*?)<\/symbol>/gi

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
  if (!opts || !opts.iconfontjs || !opts.iconfontjson) {
    console.warn('Iconfont plugin requires iconfontjs and iconfontjson options!')
    console.warn('Iconfont plugin will be skipped.')
    return () => {}
  }

  const jsSource = readFileSync(resolve(opts.iconfontjs), 'utf-8')
  const jsonSource = JSON.parse(readFileSync(resolve(opts.iconfontjson), 'utf-8')) as IconfontJson

  const fontFamily = jsonSource.font_family
  const prefix = jsonSource.css_prefix_text

  const svgMap = new Map(Array.from(jsSource.matchAll(symbolTag), ([, name, content]) => [name, `<svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">${content}</svg>`]))
  const unicodeMap = new Map(jsonSource.glyphs.map(glyph => [`${prefix}${glyph.font_class}`, glyph.unicode]))

  return function ({ addUtilities }) {
    const iconUtilities: Record<string, Record<string, string>> = {}
    for (const [name, unicode] of unicodeMap) {
      const svg = svgMap.get(name)
      if (!svg) {
        console.warn(`[iconfontail] icon "${name}" found in JSON but missing in JS file, skipped.`)
        continue
      }
      const uri = `url("data:image/svg+xml;utf8,${encodeSvg(svg)}")`
      const mode = svg.includes('currentColor') ? 'mask' : 'background'
      iconUtilities[`.${name}.color`] = {
        [mode]: `${uri} no-repeat center`,
        backgroundColor: mode === 'mask' ? 'currentColor' : 'transparent',
        height: '1em',
        width: '1em',
      }
      iconUtilities[`.${name}.font::before`] = {
        content: `"\\${unicode}"`,
        fontFamily,
      }
    }
    addUtilities(iconUtilities)
  }
})

export default plugin
