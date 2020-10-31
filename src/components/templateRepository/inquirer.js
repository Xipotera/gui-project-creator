const inquirer = require('inquirer');
const { get } = require('lodash');
const CLI = require('clui');

const { Spinner } = CLI;
const gitlab = require('../../connectors/gitlab');
const github = require('../../connectors/github');

module.exports = {
    askWichTemplateUserWantToUse: (data) => {
        const questions = [
            {
                type: 'list',
                name: 'template',
                message: 'Which project template you want to use ?',
                choices: [
                    ...Object.keys(get(data, 'templates', [])),
                ],
                default: get(data, 'template'),
            },
        ];
        return inquirer.prompt(questions);
    },

    askNewTemplateRepositoryData: (templateProjectList = []) => {
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter a name for the template configuration:',
                default: 'project',
                validate(value) {
                    if (value.length) {
                        if (templateProjectList.map((name) => name.toLowerCase()).includes(value.toLowerCase())) {
                            return `The template configuration '${value}' already exists.\n`
                                + 'Please enter a different name.';
                        }
                        return true;
                    }
                    return 'Please enter a name for the template configuration.';
                },
            },
            {
                type: 'list',
                name: 'server',
                message: 'On which server project template was stored ?',
                choices: [
                    { name: 'Gitlab', value: 'gitlab' },
                    { name: 'Github', value: 'github' },
                ],
                default: 1,
            },
            // {
            //     when: (answers) => get(answers, 'server') === 'gitlab',
            //     type: 'confirm',
            //     name: 'server-type',
            //     message: 'Using a personal Gitlab server ?',
            //     default: false,
            // },
            // {
            //     when: (answers) => get(answers, 'server') === 'gitlab' && get(answers, 'server-type'),
            //     type: 'input',
            //     name: 'url',
            //     message: 'Enter your personal Gitlab URL server:',
            //     validate(value) {
            //         const valid = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(value);
            //         return valid || 'Please enter a valid url.';
            //     },
            // },
            {
                type: 'list',
                name: 'visibility',
                message: 'Template project visibility ?',
                choices: [
                    { name: 'Public', value: 'public' },
                    { name: 'Private', value: 'private' },
                ],
                default: 1,

            },
        ];
        return inquirer.prompt(questions);
    },

    askTemplateTokenAccess: (data) => {
        const questions = [
            {
                when: get(data, 'visibility') === 'private',
                type: 'input',
                name: 'token',
                message: `Enter ${get(data, 'server')} Access Token:`,
                async validate(value) {
                    if (value.length) {
                        const status = new Spinner('Authenticating you, please wait...');
                        status.start();
                        try {
                            if (get(data, 'server') === 'gitlab') {
                                await gitlab.verifyPersonalToken(value);
                            } else {
                                await github.verifyPersonalToken(value);
                            }

                            status.stop();
                            return true;
                        } catch (e) {
                            status.stop();
                            return 'Please enter a valid Access Token.';
                        }
                    }
                    return 'Please enter Access Token.';
                },
            },
        ];
        return inquirer.prompt(questions);
    },

    askTemplateProjectId: async (data) => {
        const questions = [
            {
                when: get(data, 'server') === 'gitlab',
                type: 'input',
                name: 'id',
                message: 'Template project Id repository:',
                async validate(value) {
                    const valid = !isNaN(parseFloat(value));
                    if (!valid) return 'Please enter a valid template project Id.';
                    const status = new Spinner('Verifying template project access rights...');
                    status.start();
                    try {
                        await gitlab.getProjectById(get(data, 'token'), value);
                        status.stop();
                        return true;
                    } catch (e) {
                        status.stop();
                        return 'Your token does not allow access to this template project.';
                    }
                },
                filter: Number,
            },
            {
                when: get(data, 'server') === 'github',
                type: 'input',
                name: 'path',
                message: 'Template Project URL repository:',
                async validate(value) {
                    const status = new Spinner('Verifying template project access rights...');
                    status.start();
                    try {
                        if (value.length) {
                            await github.getProjectByPath(get(data, 'token'), value);

                            status.stop();
                            return true;
                        }
                    } catch (e) {
                        status.stop();
                        return 'Your token does not allow access to this template project.';
                    }
                },
                filter(val) {
                    return val.toLowerCase();
                },
            },

        ];
        return inquirer.prompt(questions);
    },

    askBranchTemplateToUse: async (data) => {
        const status = new Spinner('Searching branch(s) template project...');
        status.start();
        let branchs = [];
        if (get(data, 'server') === 'gitlab') branchs = await gitlab.getBranchRepository(get(data, 'token'), get(data, 'id'));
        else branchs = await github.getBranchRepository(get(data, 'token'), get(data, 'path'));
        status.stop();
        const questions = [
            {
                type: 'list',
                name: 'branch',
                message: 'Which branch do you want to use ?',
                choices: branchs,
            },
        ];
        return inquirer.prompt(questions);
    },
    askWichTemplateDelete: (templateProjectList) => {
        const questions = [
            {
                type: 'list',
                name: 'template',
                message: 'Which project template you want to delete ?',
                choices: [
                    ...templateProjectList,
                    new inquirer.Separator(),
                    'Exit',
                ],
                default: 'Exit',
                filter(val) {
                    return val;
                },
            },


        ];
        return inquirer.prompt(questions);
    },

    askDeletionConfirmation: (template) => {
        const questions = [
            {
                type: 'confirm',
                name: 'confirm',
                message: `Are yous sure you want delete ${template} template configuration?`,
                default: false,
            },


        ];
        return inquirer.prompt(questions);
    },

};
