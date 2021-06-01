module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "reporters": [
    "default",
    ["jest-html-reporters", {
      "publicPath": "./reports",
      "filename": "test.report.html",
      "expand": true,
      "openReport": false
    }]
  ],
};
