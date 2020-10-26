const { get, sortBy } = require('lodash');
const chalk = require('chalk');
const inquirer = require('./inquirer');
const config = require('../../config');
const { groupsRepository } = require('../../connectors/gitlab');
const { saveConfiguration, deleteConfiguration } = require('./controller');


module.exports = {
    userStorageRepositoryAddNewConfiguration: async () => {
        const data = config.getStorageConfiguration();
        const storageNames = Object.keys(get(data, 'storages', []));
        console.log(chalk.blue('Let\'s set up a new storage !'));
        let answers = await inquirer.askNewStorageRepositoryServer();
        switch (get(answers, 'server')) {
            case 'gitlab':
                answers = { ...answers, ...await inquirer.askNewStorageName(storageNames, answers) };
                answers = { ...answers, ...await inquirer.askUserGitlabPersonalToken(answers) };
                // eslint-disable-next-line no-case-declarations
                const groups = sortBy(await groupsRepository(get(answers, 'token')), ['full_path']).map((group) => ({ full_path: group.full_path, id: group.id }));
                answers = { ...answers, ...await inquirer.askNamespaceStorageRepositoryData(groups) };

                break;
            default:
                console.log(chalk.red('See you soon!!!'));
                process.exit();
        }
        // answers = { ...answers, ...await inquirer.askTemplateProjectId(answers) };
        // answers = { ...answers, ...await inquirer.askBranchTemplateToUse(answers) };
        // Now store new user storage repository
        await saveConfiguration(answers);
    },

    userStorageRepositoryConfigurationDeletion: async () => {
        const data = config.getStorageConfiguration();
        const storageNames = Object.keys(get(data, 'storages', []));
        let answers = await inquirer.askWichStorageDelete(storageNames);
        answers = { ...answers, ...await inquirer.askDeletionConfirmation(get(answers, 'storage')) };
        await deleteConfiguration(answers);
    },
};
