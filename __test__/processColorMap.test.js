const processColorMap = require('../util/processColorMap')

test('processColorMap', () => {
  const testColorMap = {
    'ink': {
      'DEFAULT': '#242424',
      'bold': '#000000'
    },
    '@dark': {
      'ink': {
        DEFAULT: '#ddd',
        bold: '#fff'
      }
    }
  }

  const processed = processColorMap(testColorMap)

  expect(processed).toMatchObject({
    'default': {
      'ink': '#242424',
      'ink-bold': '#000000'
    },
    'dark': {
      'ink': '#ddd',
      'ink-bold': '#fff'
    }
  })
})
