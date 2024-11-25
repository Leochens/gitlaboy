const path = require('path');
const home = path.join((process.env.HOME || process.env.USERPROFILE), '.gt');

module.exports = {
    HOME: home
}