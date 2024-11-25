const {
    HOME
} = require('../config');
const fs = require('fs');
const {
    default: chalk
  } = require('chalk');

module.exports = function () {
    if (!fs.existsSync(HOME)) {
        console.log(chalk.red(`gt配置目录不存在，请先执行\n  gt-init \n初始化后再进行其他操作！`))
        return false
    }
    return true

}