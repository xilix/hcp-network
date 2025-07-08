module.exports = {
  preset: 'ts-jest',
  coverageReporters: ['text', 'cobertura'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src$1',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!d3|internmap|delaunator|robust-predicates)'
  ],
  modulePathIgnorePatterns: ['<rootDir>/functions/', '<rootDir>/server/', '<rootDir>/dist/'],
}