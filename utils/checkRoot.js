const chalk = require('chalk');
const { HOME } = require('../config');
const getConfig = require('./getConfig');
const checkHomePath = require('./checkHomePath');
// 检查是否初始化
function checkRoot() {

    if(!checkHomePath()) return;
    const config = getConfig();
    if (config) {
        if (!config?.baseConfig?.['gitUser-privateToken']) {
            console.log(chalk.red(`gt未初始化，请先执行\n  gt-init \n初始化后再进行其他操作！`))
            return false
        } else {
            return HOME;
        }
    } else {
        return false;
    }

}

module.exports = checkRoot;