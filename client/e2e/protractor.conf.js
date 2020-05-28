// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const { SpecReporter } = require('jasmine-spec-reporter');

require('dotenv').config();
require('ts-node/register');
require('tsconfig-paths/register');
require('ts-node').register({
  project: require('path').join(__dirname, './tsconfig.e2e.json')
});

const fs = require('fs-extra');

const { tablet, iphone5 } = require('@src-e2e/shared/devices-sizes');
const getFileName = (name, version, size) =>
  `${name}-${version}-${size.width}x${size.height}`;

exports.config = {
  allScriptsTimeout: 11000,
  multiCapabilities: [
    {
      browserName: 'chrome',
      chromeOptions: {
        args: [
          '--headless',
          '--lang=ru',
          `--window-size=${tablet.width},${tablet.height}`
        ]
      },
      specs: ['./src/**/*.e2e-spec.ts'],
      exclude: ['./src/**/*.screen-sm.e2e-spec.ts']
    },
    {
      browserName: 'chrome',
      chromeOptions: {
        args: [
          '--headless',
          '--lang=ru',
          `--window-size=${iphone5.width},${iphone5.height}`
        ],
        mobileEmulation: {
          deviceName: 'iPhone 5/SE'
        }
      },
      specs: ['./src/**/*.e2e-spec.ts'],
      exclude: ['./src/**/*.screen-lg.e2e-spec.ts']
    }
  ],
  maxSessions: 1,
  // ...(process.env.CI === 'true' && {
  //   chromeDriver:
  //     '../node_modules/webdriver-manager/selenium/chromedriver_80.0.3987.163'
  // }),
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
  beforeLaunch() {
    fs.emptyDir('e2e-tests-results/screenshots/', function(err) {
      console.log(err);
    });
  },
  onPrepare() {
    jasmine
      .getEnv()
      .addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    const jasmineReporters = require('jasmine-reporters');
    Promise.all([
      browser
        .manage()
        .window()
        .getSize(),
      browser.getCapabilities()
    ]).then(function([size, caps]) {
      jasmine.getEnv().addReporter(
        new jasmineReporters.JUnitXmlReporter({
          consolidateAll: true,
          savePath: './e2e-tests-results/',
          disableHTMLReport: true,
          disableScreenshot: true,
          filePrefix: getFileName(
            caps.get('browserName'),
            caps.get('version'),
            size
          )
        })
      );
    });

    jasmine.getEnv().addReporter({
      specDone: function(result) {
        if (result.status == 'failed') {
          Promise.all([
            browser
              .manage()
              .window()
              .getSize(),
            browser.getCapabilities()
          ]).then(function([size, caps]) {
            const browserName = caps.get('browserName');
            const browserVersion = caps.get('version');

            browser.takeScreenshot().then(function(png) {
              var stream = fs.createWriteStream(
                'e2e-tests-results/screenshots/' +
                  getFileName(browserName, browserVersion, size) +
                  '-' +
                  result.fullName +
                  '.png'
              );
              stream.write(new Buffer(png, 'base64'));
              stream.end();
            });
          });
        }
      }
    });
  },
  onComplete() {
    Promise.all([
      browser
        .manage()
        .window()
        .getSize(),
      browser.getCapabilities()
    ]).then(function([size, caps]) {
      const browserName = caps.get('browserName');
      const browserVersion = caps.get('version');
      const fileNamePrefix = `${getFileName(
        browserName,
        browserVersion,
        size
      )}`;
      platform = caps.get('platform');
      const HTMLReport = require('protractor-html-reporter-2');
      testConfig = {
        reportTitle: `Protractor Test Execution Report ${size.width}x${size.height}`,
        outputPath: './e2e-tests-results/',
        outputFilename: `ProtractorTestReport ${fileNamePrefix}`,
        screenshotPath: './screenshots',
        testBrowser: browserName,
        browserVersion: browserVersion,
        modifiedSuiteName: false,
        screenshotsOnlyOnFailure: true,
        testPlatform: platform
      };
      new HTMLReport().from(
        `./e2e-tests-results/${fileNamePrefix}.xml`,
        testConfig
      );
    });
  }
};
