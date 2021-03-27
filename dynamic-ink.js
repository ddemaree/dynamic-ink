const plugin = require('tailwindcss/plugin')
const defaultThemeColors = require('./defaultThemeColors')
const processColorMap = require('./util/processColorMap')
const _ = require('lodash')

// Add support for utility-based theming
const dynamicInk = plugin.withOptions(function(options = {}) {
  const cpPrefix = options.prefix ?? 'color'
  const addSetterClasses = options.setterClasses ?? false
  const setBaseStyles = options.setBaseStyles ?? true
  const componentClassName = options.componentClassName ?? 'dynamic-ink'

  return function({ addUtilities, addBase, addComponents, theme, variants, config, corePlugins }) {
    const darkMode = config('darkMode')

    const themeColorVariants = variants('themeColors', ['dark', 'hover'])
    const themeColors = theme('themeColors', defaultThemeColors)

    const inkMap = processColorMap(themeColors)
    
    const allInkKeys = _.uniq(Object.values(inkMap).flatMap(obj => Object.keys(obj)))

    const cpKey = key => `--${cpPrefix}-${key}`
    const cpVar = key => `var(${cpKey(key)}, ${inkMap.default[key]})`

    // Create utilities for setting theme colors, e.g. `.set-background-gray-800` sets --color-background: theme('colors.warmGray.800')
    const getInkSetterUtils = (colors, utilsObj = {}, prefix = '') => {
      const colorPairs = Object.entries(colors)

      colorPairs.forEach(([key, values]) => {
        if(typeof values === 'string') {
          _.forEach(allInkKeys, themeColorKey => {
            if(values !== 'currentColor') {
              utilsObj[`.set-${themeColorKey}${prefix}-${key}`] = {
                [cpKey(themeColorKey)]: values
              }
            }
          })
        } else if(typeof values === 'object') {
          getInkSetterUtils(values, utilsObj, `-${key}`)
        }
      })

      return utilsObj
    }

    if(addSetterClasses)
      addUtilities(getInkSetterUtils(colors), [])

    const makeUtilities = (classPrefix, property) => {
      return Object.assign(
        {}, 
        ...allInkKeys.flatMap(key => [{[`.${classPrefix}-${key}`]: {[property]: cpVar(key)}}])
      )
    }

    if(corePlugins('textColor'))
      addUtilities(makeUtilities('text', 'color'), themeColorVariants);

    if(corePlugins('backgroundColor'))
      addUtilities(makeUtilities('bg', 'background-color'), themeColorVariants);

    if(corePlugins('borderColor'))
      addUtilities(makeUtilities('border', 'border-color'), themeColorVariants);

    if(corePlugins('fill'))
      addUtilities(makeUtilities('fill', 'fill'), themeColorVariants);

    // TODO: Support divideColor plugin
    // TODO: Support ringColor plugin

    if(setBaseStyles) {
      // Set defaults
      addBase({
        ':root': Object.assign(
          {},
          ...Object.entries(inkMap.default).flatMap(([key, value]) => [{[cpKey(key)]: value}])
        )
      })

      if(darkMode === 'media') {
        addBase({
          ':root': {
            '@media (prefers-color-scheme: dark)': Object.assign(
              {},
              ...Object.entries(inkMap.dark).flatMap(([key, value]) => [{[cpKey(key)]: value}])
            )
          }
        })
      } else if(darkMode === 'class') {
        // TODO: Support class-based dark mode
      }
    }

    // TODO: Make this mapping more configurable
    addComponents({
      [`.${componentClassName}`]: {
        backgroundColor: cpVar('background'),
        color: cpVar('ink'),
        'b, strong': {
          color: cpVar('ink-bold')
        },
        'a': {
          color: cpVar('accent')
        }
      }
    })
  }
})

module.exports = dynamicInk