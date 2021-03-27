const flattenColorMap = require('../util/flattenColorMap')

test('flattenColorMap', () => {
  const testColorMap = {
    '@default': {
      'ink': {
        'DEFAULT': '#242424',
        'bold': '#000000'
      }
    }
  }

  const flattenedMap = flattenColorMap(testColorMap['@default'])
  expect(flattenedMap).toMatchObject({
    'ink': '#242424',
    'ink-bold': '#000000'
  })
  console.log(flattenedMap)
})