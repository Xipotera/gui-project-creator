const path = require('path');
/**
 * @description find the project path root
 * used for email template on send
 * @type {string}
 */
module.exports = (function () {
    return path.dirname(require.main.filename || process.mainModule.filename);
}());
