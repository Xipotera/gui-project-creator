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
    askProjectConfiguration: () => {
        const questions = [
            {
                // eslint-disable-next-line camelcase
                type: 'list',
                name: 'choice',
                message: 'Which part of the program do you want to re-configure ?',
                choices: [
                    'All',
                    'Personal Token Access',
                    'Template Repository',
                    new inquirer.Separator(),
                    'Exit',
                ],
                default: 'All',
                filter(val) {
                    switch (snakeCase(val)) {
                        case 'personal_token_access':
                            return 'gitlab';
                        case 'template_repository':
                            return 'templates';
                        default:
                            return val.toLowerCase();
                    }
                },
            },
            {
                when(answers) {
                    return answers.choice === 'all';
                },
                type: 'confirm',
                name: 'confirm_input',
                message: 'Erase existing configuration ?',
                default: false,
            },
            {
                when(answers) {
                    return answers.choice === 'gitlab';
                },
                type: 'confirm',
                name: 'confirm_input',
                message: 'Are you sure you want to re-configure personal access token ?',
                default: false,
            },
            {
                when(answers) {
                    return answers.choice === 'templates';
                },
                type: 'confirm',
                name: 'confirm_input',
                message: 'Are you sure you want to re-configure template ?',
                default: false,
            },
        ];

        return inquirer.prompt(questions);
    },


};
