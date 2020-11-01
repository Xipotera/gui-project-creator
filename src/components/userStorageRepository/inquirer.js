const inquirer = require('inquirer');
const { find, get } = require('lodash');
const CLI = require('clui');

const { Spinner } = CLI;
const gitlab = require('../../connectors/gitlab');
const github = require('../../connectors/github');

module.exports = {
    askNewStorageRepositoryServer: () => {
        const questions = [
            {
                type: 'list',
                name: 'server',
                message: 'For which Server do you want create a storage configuration ?',
                choices: [
                    { name: 'Gitlab', value: 'gitlab' },
                    { name: 'Github', value: 'github' },

                ],
                filter(value) {
                    return value.toLowerCase();
                },
            },

        ];
        return inquirer.prompt(questions);
    },
    askNewStorageName: (storageList, data) => {
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter a name for the storage configuration:',
                default: get(data, 'server', null),
                validate(value) {
                    if (value.length) {
                        if (storageList.map((name) => name.toLowerCase()).includes(value.toLowerCase())) {
                            return `The storage configuration '${value}' already exists.\n`
                        + 'Please enter a different name.';
                        }
                        return true;
                    }
                    return 'Please enter a name for the storage configuration.';
                },
            }];
        return inquirer.prompt(questions);
    },
    askStorageTokenAccess: (data) => {
        const questions = [
            {
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

    askNamespaceStorageRepositoryData: (data, groups, namespaceId = undefined) => {
        const questions = [
            {
                when: get(data, 'server') === 'gitlab',
                type: 'list',
                name: 'namespaceId',
                message: 'Optionally choose namespace where the project repository will be created:',
                choices: ['None', ...groups.map((group) => group.full_path), new inquirer.Separator()],
                default: get(find(groups, { id: namespaceId }), 'full_path', 'None'),
                filter(val) {
                    return get(find(groups, { full_path: val }), 'id');
                },
            }];
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

    askWichStorageDelete: (templateProjectList) => {
        const questions = [
            {
                type: 'list',
                name: 'storage',
                message: 'Which storage configuration you want to delete ?',
                choices: [
                    ...templateProjectList,
                    new inquirer.Separator(),
                    { name: 'Exit', value: 'exit' },
                ],
                default: 'exit',

            },


        ];
        return inquirer.prompt(questions);
    },

    askDeletionConfirmation: (template) => {
        const questions = [
            {
                type: 'confirm',
                name: 'confirm',
                message: `Are yous sure you want delete ${template} storage configuration?`,
                default: false,
            },


        ];
        return inquirer.prompt(questions);
    },


};
