const fs = require('fs');
const path = require('path');
const { HOME } = require('../config');
const home = HOME

function getConfig() {

    // 家目录不存在 需要创建
    if (!fs.existsSync(home)) {
        fs.mkdirSync(home);
    }
    // 存放所有变量
    const configFilePath = path.join(home, 'config.json');
    // 不存在需要创建config.json
    if (!fs.existsSync(configFilePath)) {
        try {
            const config = {}
            fs.writeFileSync(configFilePath, JSON.stringify({
                baseConfig: {},
                projectConfig: {}
            }));
            return config;
        } catch (e) {
            console.error("创建配置文件config.json失败,请检查是否拥有是管理员权限", e);
            return null;
        }
    } else {
        const config = require(configFilePath)
        return config;
    }
}

module.exports = getConfig;