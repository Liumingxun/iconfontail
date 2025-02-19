import plugin from 'tailwindcss/plugin'
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type IconName = string
type IconContent = string

type Options = {
  /**
   * Path to the SVG file
   */
  source: string
  /**
   * Prefix for the generated icon classes
   */
  prefix?: string
  /**
   * Extract function to parse the SVG source and return a record of icon names and their content
   * @param source All of SVG string that was read from the source file
   * @returns A record of icon names and their content
   */
  extract?: (source: string) => Record<IconName, IconContent>
}

function encodeSvg(svg: string) {
  return svg
    .replace(/"/g, '\'')
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/\{/g, '%7B')
    .replace(/\}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
}

export default plugin.withOptions<Options>((options) => {
  const source = readFileSync(resolve(options.source), 'utf-8')
  const prefix = options.prefix ?? ''
  let icons: Record<string, string> = {}

  if (!options.extract) {
    const regex = /<symbol id="([^"]+)".*?>(.*?)<\/symbol>/gim;
    icons = Array.from(source.matchAll(regex))
      .reduce<Record<string, string>>((set, [_, name, content]) => ({
        ...set,
        [name]: `<svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">${content}</svg>`
      }), {});
  } else {
    icons = options.extract(source)
  }

  return ({ addUtilities }) => {
    const iconUtilities = Object.entries(icons).reduce((acc, [name, content]) => {
      const className = `.${prefix}${name}`;
      const uri = `url("data:image/svg+xml;utf8,${encodeSvg(content)}")`
      const mode = content.includes('currentColor') ? 'mask' : 'background'
      return {
        ...acc,
        [className]: {
          [mode]: `${uri} no-repeat center`,
          backgroundColor: mode === 'mask' ? 'currentColor' : 'transparent',
          height: '1em',
          width: '1em',
        }
      }
    }, {})

    addUtilities(iconUtilities, {
      respectPrefix: true
    })
  }
})