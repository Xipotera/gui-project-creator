const inquirer = require('inquirer');
const { get, snakeCase } = require('lodash');

module.exports = {
    askAppGlobalConfiguration: (app) => {
        const questions = [
            {
                when: !get(app, 'title'),
                type: 'text',
                name: 'title',
                message: 'Name to display on title app ?',
                default: 'Starter',
            },
        ];

        return inquirer.prompt(questions);
    },
    askProgramConfiguration: () => {
        const questions = [
            {
                // eslint-disable-next-line camelcase
                type: 'list',
                name: 'choice',
                message: 'Which part of the program do you want to configure ?',
                choices: [
                    'User Storage Repository',
                    'Templates',
                    'Reset',
                    new inquirer.Separator(),
                    'Exit',
                ],
                filter(val) {
                    return snakeCase(val.toLowerCase());
                },
            },
        ];

        return inquirer.prompt(questions);
    },
    askActionConfiguration: () => {
        const questions = [{
            type: 'list',
            name: 'action',
            message: 'What do you want to do ?',
            choices: [
                'Add',
                'Edit',
                'Delete',
                new inquirer.Separator(),
                'Exit',
            ],
            default: 'Add',
            filter(val) {
                return snakeCase(val.toLowerCase());
            },
        }];
        return inquirer.prompt(questions);
    },
    askResetConfigurationConfirmation: () => {
        const questions = [{
            type: 'confirm',
            name: 'confirm',
            message: 'Really ? Resetting all configurations ?',
            default: false,
        }];
        return inquirer.prompt(questions);
    },

};
