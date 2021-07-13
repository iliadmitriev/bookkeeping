module.exports = {

  verbose: true,

  testEnvironment: 'jsdom',

  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],

  transformIgnorePatterns: [
    'node_modules/(?!vuetify)'
  ],


  moduleNameMapper: {
    "^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    // enable import beginning with @/ - as reference to <root>/src/ folder
    "^@/(.*)$": "<rootDir>/src/$1"
  },

  modulePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/'
  ],

  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.(js)$': 'babel-jest'
  },

  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,vue}', '!**/node_modules/**'],
  coveragePathIgnorePatterns: [],
  coverageThreshold: {
    global: {
      branches: 46,
      functions: 54,
      lines: 62,
      statements: 62
    }
  },

}
