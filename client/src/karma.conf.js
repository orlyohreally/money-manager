// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['parallel', 'jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-parallel'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage/money-manager'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    parallelOptions: {
      executors: 4, // Defaults to cpu-count - 1
      shardStrategy: 'round-robin'
      // shardStrategy: 'description-length'
      // shardStrategy: 'custom'
      // customShardStrategy: function(config) {
      //   config.executors // number, the executors set above
      //   config.shardIndex // number, the specific index for the shard currently running
      //   config.description // string, the name of the top-level describe string. Useful //     for determining how to shard the current specs
      //   return config.
      // }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome' /*'ChromeHeadless'*/],
    singleRun: false,
    restartOnFileChange: true
  });
};
