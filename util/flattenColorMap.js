const flattenColorMap = colors =>
  Object.assign(
    {},
    ...Object.entries(colors).flatMap(([color, values]) =>
      typeof values == 'object'
        ? Object.entries(flattenColorMap(values)).map(([key, hex]) => ({
            [color + (key === 'DEFAULT' ? '' : `-${key}`)]: hex,
          }))
        : [{ [`${color}`]: values }]
    )
  )


module.exports = flattenColorMap