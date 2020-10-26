const inquirer = require('inquirer');
const { get } = require('lodash');
const CLI = require('clui');

const { Spinner } = CLI;
const { verifyPersonalToken, getBranchRepository, getProjectById } = require('../../connectors/gitlab');

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
                    'Gitlab',
                ],
                default: 'Gitlab',
            },
            // {
            //     when: (answers) => get(answers, 'server') === 'Gitlab',
            //     type: 'confirm',
            //     name: 'server-type',
            //     message: 'Using a personal Gitlab server ?',
            //     default: false,
            // },
            // {
            //     when: (answers) => get(answers, 'server') === 'Gitlab' && get(answers, 'server-type'),
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
                    'Public',
                    'Private',
                ],
                default: 'Private',

            },
        ];
        return inquirer.prompt(questions);
    },

    askTemplateTokenAccess: (data) => {
        const questions = [
            {
                when: get(data, 'server') === 'Gitlab' && get(data, 'visibility') === 'Private',
                type: 'input',
                name: 'token',
                message: 'Enter Template Access Token:',
                async validate(value) {
                    if (value.length) {
                        const status = new Spinner('Authenticating you, please wait...');
                        status.start();
                        try {
                            await verifyPersonalToken(value);
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
                when: get(data, 'server') === 'Gitlab',
                type: 'input',
                name: 'id',
                message: 'Template project Id repository:',
                async validate(value) {
                    const valid = !isNaN(parseFloat(value));
                    if (!valid) return 'Please enter a valid template project Id.';
                    const status = new Spinner('Verifying of template project access rights...');
                    status.start();
                    try {
                        await getProjectById(get(data, 'token'), value);
                        status.stop();
                        return true;
                    } catch (e) {
                        status.stop();
                        return 'Your token does not allow access to this template project.';
                    }
                },
                filter: Number,
            },


        ];
        return inquirer.prompt(questions);
    },

    askBranchTemplateToUse: async (data) => {
        const status = new Spinner('Searching branch(s) template project...');
        status.start();
        const branchs = await getBranchRepository(get(data, 'token'), get(data, 'id'));
        status.stop();
        const questions = [
            {
                when: get(data, 'server') === 'Gitlab',
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
