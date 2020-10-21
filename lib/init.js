const inquirer = require('inquirer');
const { get, snakeCase } = require('lodash');
const config = require('./configStorage');

module.exports = {
    askAppGlobalConfiguration: () => {
        const app = config.getAsciiArt();
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
    storeAppGlobalConfiguration: (data) => {
        config.setAsciiArt(data);
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
                    'Skeleton Repository',
                    new inquirer.Separator(),
                    'Exit',
                ],
                default: 'All',
                filter(val) {
                    switch (snakeCase(val)) {
                        case 'personal_token_access':
                            return 'gitlab';
                        case 'skeleton_repository':
                            return 'skeletons';
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
                    return answers.choice === 'skeletons';
                },
                type: 'confirm',
                name: 'confirm_input',
                message: 'Are you sure you want to re-configure skeleton ?',
                default: false,
            },
        ];

        return inquirer.prompt(questions);
    },
    launchAction: async (data) => {
        switch (true) {
            case !!(get(data, 'choice') === 'all' && get(data, 'confirm_input') === true):
                config.clearConfigStore();
                break;
            case !!(get(data, 'choice') === 'gitlab' && get(data, 'confirm_input') === true):
            case !!(get(data, 'choice') === 'skeleton' && get(data, 'confirm_input') === true):
                config.clearSpecificKey(get(data, 'choice'));
                break;
            default:
                process.exit(1);
        }
    },

    initApp: () => config.getAsciiArt(),

};
