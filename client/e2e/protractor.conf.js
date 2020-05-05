// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const { SpecReporter } = require('jasmine-spec-reporter');
const { HttpClient } = require('protractor-http-client');

require('dotenv').config();
require('ts-node/register');
require('tsconfig-paths/register');

exports.config = {
  allScriptsTimeout: 11000,
  specs: ['./src/**/*.e2e-spec.ts'],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--lang=en', '--window-size=800,600']
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  paths: {
    '@src-e2e/*': ['./src/*']
  },
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
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
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    var http = new HttpClient(browser.params.backendURL);
    var testingUsersApi = `/testing/user/ivan-petrov-test@gmail.com`;
    http.delete(testingUsersApi, {
      Authorization: browser.params.testingCredentials
    });
    testingUsersApi = `/users/signin`;
    const { testedUser } = require('@src-e2e/shared/tested-user');
    http.post(testingUsersApi, testedUser);

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
