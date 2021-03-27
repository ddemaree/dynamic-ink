const colors = require('tailwindcss/colors')
const { white, black, red, warmGray } = colors

module.exports = {
  '@default': {
    'background': white,
    'ink': {
      'DEFAULT': warmGray['800'],
      'bold': black,
      'medium': warmGray['500'],
      'light': warmGray['200'],
      'xlight': warmGray['50'],
    },
    'accent': {
      'DEFAULT': red['600'],
      'light': red['200'] 
    }
  },
  '@dark': {
    'background': warmGray['900'],
    'ink': {
      'DEFAULT': warmGray['300'],
      'bold': white,
      'medium': warmGray['500'],
      'light': warmGray['700'],
      'xlight': warmGray['800'],
    },
    'accent': {
      'DEFAULT': red['400'],
      'light': red['700']
    }
  }
}