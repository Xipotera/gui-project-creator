const chalk = require('chalk');
const { get, isEmpty } = require('lodash');

const config = require('../../config');
const { saveConfiguration, deleteConfiguration, getTemplateRepository } = require('./controller');
const inquirer = require('./inquirer');


module.exports = {
    templateSelection: async () => {
        const data = { ...config.getLastProjectDefault(), ...config.getTemplatesConfiguration() };
        if (isEmpty(get(data, 'templates'))) {
            console.log(chalk.red('No template configuration stored !\n'
                + 'Please launch the configuration program to add one !'));
            process.exit();
        }
        const answers = await inquirer.askWichTemplateUserWantToUse(data);
        config.setLastProjectDefault({ template: get(answers, 'template') });
    },
    templateAddNewConfiguration: async () => {
        const data = config.getTemplatesConfiguration();
        const templatesNames = Object.keys(get(data, 'templates', []));
        console.log(chalk.blue('Let\'s set up a new template project !'));
        let answers = await inquirer.askNewTemplateRepositoryData(templatesNames);
        answers = { ...answers, ...await inquirer.askTemplateTokenAccess(answers) };
        answers = { ...answers, ...await inquirer.askTemplateProjectId(answers) };
        answers = { ...answers, ...await inquirer.askBranchTemplateToUse(answers) };
        // Now store new template
        await saveConfiguration(answers);
    },

    templateConfigurationDeletion: async () => {
        const data = config.getTemplatesConfiguration();
        const templatesNames = Object.keys(get(data, 'templates', []));
        let answers = await inquirer.askWichTemplateDelete(templatesNames);
        answers = { ...answers, ...await inquirer.askDeletionConfirmation(get(answers, 'template')) };
        await deleteConfiguration(answers);
    },
    getTemplateRepository: async (data) => await getTemplateRepository(data),

};
