const moment = require('moment');
const chalk = require('chalk');

const passedFmt = chalk.green;
const failedFmt = chalk.red;
const pendingFmt = chalk.gray;
const normalDurationFmt = chalk.yellow;
const slowDurationFmt = chalk.red;
const infoFmt = chalk.white;

const slow = 75;

class JestSpecReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunStart({ numTotalTestSuites }) {
    console.log();
    console.log(chalk.bold.underline("START:"))
    console.log(infoFmt(`Found ${numTotalTestSuites} test suites`));
  }

  onRunComplete(test, results) {
    const {
      numFailedTests,
      numPassedTests,
      numPendingTests,
      testResults,
      numTotalTests,
      numTotalTestSuites,
      startTime,
    } = results;

    console.log()
    console.log(chalk.green(`Finished ${numTotalTests} tests in ${numTotalTestSuites} test suites in ${testDuration()}`));
    console.log();
    console.log(chalk.bold.underline("SUMMARY:"));

    if (numPassedTests) {
      console.log(
        this._getStatus('passed') + passedFmt(`${numPassedTests} tests completed`)
      );
    }
    if (numPendingTests) {
      console.log(
        this._getStatus('pending') + pendingFmt(`${numPendingTests} tests skipped`)
      );
    }
    if (numFailedTests) {
      console.log(
        this._getStatus('failed') + failedFmt(`${numFailedTests} tests failed`)
      );
    }

    if (numFailedTests > 0) {
      console.log();
      console.log(chalk.bold.underline("FAILED TESTS:"));
      testResults.map(({ failureMessage }) => {
        if (failureMessage) {
          console.log(failureMessage);
        }
      });
    }

    function testDuration() {
      const delta = moment.duration(moment() - new Date(startTime));
      const seconds = delta.seconds();
      const millis = delta.milliseconds();
      return `${seconds}.${millis} secs`;
    }
  }

  previousAncestorTitles = []

  onTestResult(test, { testResults }) {
    testResults.map((result) => {
      const { title, duration, status, ancestorTitles } = result;

      let indent
      let i
      let n = Math.max(this.previousAncestorTitles.length, ancestorTitles.length);
      for(i=0; i<n; ++i) {
        if (this.previousAncestorTitles[i] !== ancestorTitles[i])
          break
      }

      indent = "  ".repeat(i)
      for(let j=i; j<ancestorTitles.length; ++j) {
        console.log(chalk.bold(`  ${indent}${ancestorTitles[j]}`));
        indent += "  ";
      }
      this.previousAncestorTitles = ancestorTitles
      indent = "  ".repeat(ancestorTitles.length)
      console.log(`  ${indent}${this._getStatus(status, title)} ${this._getDuration(duration)}`);
    });
  }

  _getStatus(status, title = "") {
    switch (status) {
      case 'passed':
        return passedFmt(`✔ ${title}`);
      default:
      case 'failed':
        return failedFmt(`✖ ${title}`);
      case 'pending':
        return pendingFmt(`✖ ${title}`);
    }
  }

  _getDuration(duration) {
    if (duration >= slow)
      return slowDurationFmt(`(${duration}ms)`);
    if (duration >= slow / 2)
      return normalDurationFmt(`(${duration}ms)`);
    return "";
  }
  
}

module.exports = JestSpecReporter;
