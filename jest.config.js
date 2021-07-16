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

  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

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
  coveragePathIgnorePatterns: [
    'src/registerServiceWorker.js',
    'src/main.js'
  ],
  coverageThreshold: {
    global: {
      branches: 86,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },

}
