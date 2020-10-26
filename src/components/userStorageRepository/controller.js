const CLI = require('clui');
const chalk = require('chalk');

const { Spinner } = CLI;
const { get, isEmpty } = require('lodash');


const gitlab = require('../../connectors/gitlab');
const config = require('../../config');

module.exports = {
    verifyPersonalToken: async (data) => {
        try {
            return true;
        } catch (err) {
            return false;
        }
    },
    saveConfiguration: (data) => {
        const storage = {
            [get(data, 'name')]: {
                server: get(data, 'server'),
                token: get(data, 'token'),
                namespaceId: get(data, 'namespaceId'),
                visibility: get(data, 'visibility'),
            },
        };
        config.setStorageDefaultData(storage);
        console.log(chalk.green('Storage configuration saved!'));
        console.log(chalk.green('All done!'));
        process.exit();
    },

    deleteConfiguration: (answers) => {
        if (get(answers, 'confirm') === true) {
            config.clearSpecificKey(`storages.${get(answers, 'storage')}`);
            console.log(chalk.green(`Storage '${get(answers, 'storage')}' configuration deleted!`));
        }
        console.log(chalk.green('All done!'));
        process.exit();
    },
};
