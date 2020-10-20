const inquirer = require('inquirer');

module.exports = {
    askGitlabPersonalToken: () => {
        const questions = [
            {
                name: 'personal_token',
                type: 'input',
                message: 'Enter your Gitlab Personal Access Token:',
                default: 'EvEQYnfEYbfQ6X6x1_yQ',
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
    askRepoDetails: ({ visibility, namespace_id }) => {
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
                // eslint-disable-next-line camelcase
                when: !namespace_id,
                type: 'input',
                name: 'namespace_id',
                message: 'Optionally enter a Namespace Id where the project repository will be created:',
                validate(value) {
                    const valid = !isNaN(parseFloat(value));
                    return valid || 'Please enter a valid Namespace Id';
                },
                filter: Number,

            },
            {
                when: !visibility,
                type: 'list',
                name: 'visibility',
                message: 'Public or private:',
                choices: ['public', 'private'],
                default: 'public',
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
