const { get } = require('lodash');
const config = require('../../config');

module.exports = {
    storeAppGlobalConfiguration: (data) => {
        config.setAsciiArt(data);
    },
    launchAction: async (data) => {
        switch (true) {
            case !!(get(data, 'choice') === 'all' && get(data, 'confirm_input') === true):
                config.clearConfigStore();
                break;
            case !!(get(data, 'choice') === 'gitlab' && get(data, 'confirm_input') === true):
            case !!(get(data, 'choice') === 'template' && get(data, 'confirm_input') === true):
                config.clearSpecificKey(get(data, 'choice'));
                break;
            default:
                process.exit(1);
        }
    },


};
