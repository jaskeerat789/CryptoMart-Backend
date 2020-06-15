const chalk = require('chalk');
const log = console.log
var debug = {

}

debug.logHeader = function (string) {
  log("");
  log(chalk.blue("**********"), chalk.blue.bold(string), chalk.blue("**********"));  //cyan
  log("");
}

debug.logSection = function (string) {
  log("");
  log(chalk.yellow("-----"), chalk.yellow.bold(string), chalk.yellow("-----"));  //cyan
  log("");
}

// deprecated
debug.message = function (string) {
  console.log(chalk.green(string));
}

debug.log = function (key, value) {
  debug.logSection(key)
  debug.message(value);
}

debug.error = function (string) {
  console.log(chalk.bgRed("ERROR:"), chalk.red(string));
}

debug.warn = (message)=>{
  console.log(chalk.bgYellow.black("WARNING:"),chalk.gray(message))
}
module.exports = debug;