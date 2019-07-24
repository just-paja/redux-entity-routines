module.exports = {
  projects: [
    {
      displayName: 'lint',
      runner: 'jest-runner-standard',
      testMatch: [
        '<rootDir>/**/*.{js,jsx}'
      ],
      testPathIgnorePatterns: ['<rootDir>/lib', '<rootDir>/node_modules']
    },
    {
      displayName: 'lib',
      setupFiles: [
        '<rootDir>/jest.setup.js'
      ],
      testPathIgnorePatterns: ['<rootDir>/lib', '<rootDir>/node_modules'],
      collectCoverageFrom: [
        'src/**/*.{js,jsx}'
      ],
      coveragePathIgnorePatterns: [
        '/node_modules/'
      ],
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
      }
    }
  ]
}
