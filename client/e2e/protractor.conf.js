// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const { SpecReporter } = require('jasmine-spec-reporter');

require('dotenv').config();
require('ts-node/register');
require('tsconfig-paths/register');
require('ts-node').register({
  project: require('path').join(__dirname, './tsconfig.e2e.json')
});

const { tablet } = require('@src-e2e/shared/devices-sizes');

exports.config = {
  allScriptsTimeout: 11000,
  specs: ['./src/**/*.e2e-spec.ts'],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        '--headless',
        '--lang=ru',
        `--window-size=${tablet.height},${tablet.width}`
      ]
    }
  },
  ...(process.env.CI === 'true' && {
    chromeDriver:
      '../node_modules/webdriver-manager/selenium/chromedriver_80.0.3987.163'
  }),
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  paths: {
    '@src-e2e/*': ['./src/*']
  },
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000,
    print: function() {}
  },
  params: {
    backendURL: process.env.BACKEND_URL,
    testingCredentials: process.env.TESTING_CREDENTIALS
  },
  plugins: [
    {
      package: 'jasmine2-protractor-utils',
      disableHTMLReport: false,
      outputPath: './e2e-tests-results',
      disableScreenshot: false,
      screenshotPath: './e2e-tests-results/screenshots',
      screenshotOnExpectFailure: false,
      screenshotOnSpecFailure: true,
      clearFoldersBeforeTest: true
    }
  ],
  onPrepare() {
    jasmine
      .getEnv()
      .addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: './e2e-tests-results/',
        disableHTMLReport: true,
        disableScreenshot: true,
        filePrefix: 'xmlresults'
      })
    );
  },
  onComplete: function() {
    var browserName, browserVersion;
    var capsPromise = browser.getCapabilities();

    capsPromise.then(function(caps) {
      browserName = caps.get('browserName');
      browserVersion = caps.get('version');
      platform = caps.get('platform');

      var HTMLReport = require('protractor-html-reporter-2');

      testConfig = {
        reportTitle: 'Protractor Test Execution Report',
        outputPath: './e2e-tests-results/',
        outputFilename: 'ProtractorTestReport',
        screenshotPath: './screenshots',
        testBrowser: browserName,
        browserVersion: browserVersion,
        modifiedSuiteName: false,
        screenshotsOnlyOnFailure: true,
        testPlatform: platform
      };
      new HTMLReport().from('./e2e-tests-results/xmlresults.xml', testConfig);
    });
  }
};
