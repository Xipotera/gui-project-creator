const inquirer = require('inquirer');
const { get } = require('lodash');
const files = require('../../utils/files');

module.exports = {
    askProjectConfiguration: () => {
        const argv = require('minimist')(process.argv.slice(2));
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter a name for the project:',
                default: argv._[0] || null,
                validate(value) {
                    if (value.length) {
                        if (files.directoryExists(value)) {
                            return 'There is already a folder with the same name';
                        }
                        return true;
                    }
                    return 'Please enter a name for the project.';
                },
            },
            {
                type: 'input',
                name: 'description',
                message: 'Optionally enter a project description:',
            },
        ];
        return inquirer.prompt(questions);
    },
    askProjectStorage: (data) => {
        const questions = [
            {
                type: 'list',
                name: 'server',
                message: 'Choose Server storage :',
                choices: [
                    ...Object.keys(get(data, 'storages', [])),
                    new inquirer.Separator(),
                    'None',
                    'Add new storage configuration',
                ],
                default: get(data, 'storage', 'None'),
                filter(value) {
                    switch (value) {
                        case 'None':
                            return 'none';
                        case 'Add new storage configuration':
                            return 'new';
                        default:
                            return value;
                    }
                },
            }];
        return inquirer.prompt(questions);
    },
    askProjectStorageVisibility: (data) => {
        const questions = [
            {
                type: 'list',
                name: 'visibility',
                message: 'Visibility ?',
                choices: [
                    'Public',
                    'Private',
                ],
                default: get(data, 'visibility', 'Public'),
            },
        ];
        return inquirer.prompt(questions);
    },


};
