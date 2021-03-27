const flattenColorMap = require('./flattenColorMap')

const processColorMap = map => {
  let { 
    ['@default']: _defaultColors, 
    ['@dark']: _darkColors,
    ['@light']: _lightColors,
    ..._rootColors } = map
    
  _defaultColors = flattenColorMap({
    ...(_rootColors || {}),
    ...(_defaultColors || {})
  })

  _darkColors = flattenColorMap(_darkColors || {})
  _lightColors = flattenColorMap(_lightColors || {})

  return {
    default: _defaultColors,
    dark: _darkColors,
    light: _lightColors
  }
}

module.exports = processColorMap