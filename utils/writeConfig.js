const chalk = require('chalk')
const fs = require('fs');
const path = require('path');
const home = path.join((process.env.HOME || process.env.USERPROFILE), '.gt');
const writeConfig = (config, msg) => {
    fs.writeFile(path.join(home, './config.json'), JSON.stringify(config), 'utf-8', err => {
        if (err) console.log(err)
        console.log('\n')
        console.log(chalk.green(msg))
        console.log('\n')
    })
}
module.exports = writeConfig;