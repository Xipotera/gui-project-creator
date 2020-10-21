const inquirer = require('inquirer');
const { find, get } = require('lodash');

module.exports = {
    askProjectConfiguration: () => {
        const questions = [
            {
                // eslint-disable-next-line camelcase
                type: 'input',
                name: 'skeleton_project_id',
                message: 'Gitlab skeleton project Id repository ?',
                validate(value) {
                    const valid = !isNaN(parseFloat(value));
                    return valid || 'Please enter a valid Id';
                },
                filter: Number,
            },
        ];
        return inquirer.prompt(questions);
    },


    askGitlabPersonalToken: () => {
        const questions = [
            {
                name: 'personal_token',
                type: 'input',
                message: 'Enter your Gitlab Personal Access Token:',
                validate(value) {
                    if (value.length) {
                        return true;
                    }
                    return 'Please enter your Personal access token.';
                },
            },
        ];
        return inquirer.prompt(questions);
    },
    // eslint-disable-next-line camelcase
    askRepoDetails: ({ visibility, namespace_id }, groups) => {
        const argv = require('minimist')(process.argv.slice(2));

        const questions = [


            {
                when: !argv._[0],
                type: 'input',
                name: 'name',
                message: 'Enter a name for the project:',
                default: argv._[0] || null,
                validate(value) {
                    if (value.length) {
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
            {
                type: 'list',
                name: 'namespace_id',
                message: 'Optionally choose namespace where the project repository will be created:',
                choices: ['None', ...groups.map((group) => group.full_path), new inquirer.Separator()],
                default: get(find(groups, { id: namespace_id }), 'full_path', 'None'),
                filter(val) {
                    return get(find(groups, { full_path: val }), 'id', 0);
                },
            },
            {
                // when: !visibility,
                type: 'list',
                name: 'visibility',
                message: 'Public or private:',
                choices: ['public', 'private'],
                default: visibility || 'public',
            },
        ];
        return inquirer.prompt(questions);
    },
    // eslint-disable-next-line camelcase
    askSkeletonRepositoryDetails: ({ skeleton_project_id, project_token }) => {
        const questions = [
            {
                // eslint-disable-next-line camelcase
                when: !skeleton_project_id,
                type: 'input',
                name: 'skeleton_project_id',
                message: 'Gitlab skeleton project Id repository ?',
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
