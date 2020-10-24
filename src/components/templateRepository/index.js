const chalk = require('chalk');
const sleep = require('sleep-promise');

const { get } = require('lodash');


const { saveConfiguration } = require('./controller');
const inquirer = require('./inquirer');

const config = require('../../config');



module.exports = {
    templateConfigurationInit: async () => {
        const templates = config.getTemplatesConfiguration();
        let answers = await inquirer.askWichTemplateUserWantToUse(templates);
        switch (get(answers, 'template')) {
            case 'new':
                console.log(chalk.blue('Let\'s set up a new template project !'));
                answers = { ...answers, ...await inquirer.askNewTemplateRepositoryData(templates) };
                // Now store new template
                await saveConfiguration(answers);
                console.log(chalk.green('Template project configuration saved!'));
                break;
            default:
        }
    },

};
