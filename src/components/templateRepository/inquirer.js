const inquirer = require('inquirer');
const { get } = require('lodash');

module.exports = {
    askWichTemplateUserWantToUse: (templateProjectList = []) => {
        const questions = [
            {
                type: 'list',
                name: 'template',
                message: 'Which project template you want to use ?',
                choices: [
                    'None',
                    ...templateProjectList,
                    new inquirer.Separator(),
                    'Add a new one ...',
                ],
                default: 'None',
                filter(val) {
                    switch (val) {
                        case 'Add a new one ...':
                            return 'new';
                        default:
                            return val.toLowerCase();
                    }
                },
            },


        ];
        return inquirer.prompt(questions);
    },
    askNewTemplateRepositoryData: (templateProjectList = []) => {
        const questions = [
            {
                type: 'list',
                name: 'server',
                message: 'On which server project template was stored ?',
                choices: [
                    'Gitlab',
                    'Github',
                    'BitBucket',
                ],
                default: 'Gitlab',
                filter(val) {
                    return val.toLowerCase();
                },
            },
            {
                type: 'list',
                name: 'visibility',
                message: 'Template project visibility ?',
                choices: [
                    'Public',
                    'Private',
                ],
                default: 'Public',
                filter(val) {
                    return val.toLowerCase();
                },
            },
            {
                when(answers) {
                    return get(answers, 'server') === 'gitlab'
                        && get(answers, 'visibility') === 'private';
                },
                type: 'input',
                name: 'token',
                message: 'Enter Template access token:',
                validate(value) {
                    if (value.length) {
                        return true;
                    }
                    return 'Please enter Template access token.';
                },
            },
            {
                when(answers) {
                    return get(answers, 'server') === 'gitlab';
                },
                type: 'input',
                name: 'id',
                message: 'Template project Id repository:',
                validate(value) {
                    const valid = !isNaN(parseFloat(value));
                    return valid || 'Please enter a valid project Id repository.';
                },
                filter: Number,
            },
            {
                type: 'input',
                name: 'name',
                message: 'Enter a name for the template project:',
                validate(value) {
                    if (value.length) {
                        if (templateProjectList.includes(value)) {
                            return `The template configuration '${value}' already exists.\n`
                                + 'Please enter a different name.';
                        }
                        return true;
                    }
                    return 'Please enter a name for the template project.';
                },
            },
        ];
        return inquirer.prompt(questions);
    },
    // eslint-disable-next-line camelcase
    askTemplateRepositoryDetails: ({ template_project_id, project_token }) => {
        const questions = [
            {
                // eslint-disable-next-line camelcase
                when: !template_project_id,
                type: 'input',
                name: 'template_project_id',
                message: 'Gitlab template project Id repository ?',
                validate(value) {
                    const valid = !isNaN(parseFloat(value));
                    return valid || 'Please enter a valid Id';
                },
                filter: Number,
            },
            {
                // eslint-disable-next-line camelcase
                when: !project_token,
                type: 'input',
                name: 'project_token',
                message: 'Set Project acces token:',

            },
        ];
        return inquirer.prompt(questions);
    },


};
