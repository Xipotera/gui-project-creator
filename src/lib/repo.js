const CLI = require('clui');
const { git } = require('cmd-executor');
const sleep = require('sleep-promise');
const shell = require('shelljs');


const { Spinner } = CLI;
const { get, sortBy } = require('lodash');
const { UserRepoInquirer } = require('../components/userRepository');

const { getTemplateRepository } = require('./template');

const config = require('../config');

module.exports = {
    createRemoteRepo: async (Gitlab) => {
        const storedData = config.getStoredRepositoryDefaultData();

        const groups = sortBy(await Gitlab.groupsRepository(), ['full_path']).map((group) => ({ full_path: group.full_path, id: group.id }));

        const answers = await UserRepoInquirer.askRepoDetails(storedData, groups);
        const argv = require('minimist')(process.argv.slice(2));
        const data = {
            name: get(answers, 'name', argv._[0]),
            description: get(answers, 'description'),
            visibility: get(answers, 'visibility', get(storedData, 'visibility')),
            namespace_id: get(answers, 'namespace_id', get(storedData, 'namespace_id')),
        };
        const status = new Spinner(`Creating "${get(data, 'name')}" remote repository...`);
        status.start();

        try {
            const repository = await Gitlab.createRepository(data);
            // Store Namespace ID and visibility
            config.setRepositoryDefaultData(repository);
            return {
                projectId: get(repository, 'id'),
                name: get(repository, 'name'),
                url: get(repository, 'ssh_url_to_repo'),
            };
        } finally {
            status.stop();
        }
    },

    setupRepo: async (folder, url) => {
        const status = new Spinner('Initializing local repository and pushing to remote...');
        status.start();

        // url = url.replace('gitlab.com', 'gitlab.com-home');

        try {
            await sleep(3000);
            await shell.cd(`${folder}`);
            await sleep(1000);
            await git.init();
            await git.add('./*');
            await git.remote.add('origin', url);
            await git.commit('-m "Initial commit"');
            await git.push('origin', 'master');
        } finally {
            status.stop();
        }
    },
    setupRepoBranch: async (Gitlab, id, data) => {
        const status = new Spinner(`Initializing branch "${get(data, 'new')}" on repository...`);
        status.start();
        try {
            await sleep(3000);
            await Gitlab.configureBranchRepository({
                projectId: id,
                name: get(data, 'new'),
                origin: get(data, 'origin'),
            });
        } finally {
            status.stop();
        }
    },
    setupRepoBranchUnprotectMaster: async (Gitlab, id) => {
        const status = new Spinner('Unprotect branch "master"...');
        status.start();
        try {
            await sleep(2000);
            await Gitlab.unprotectMasterBranch({
                projectId: id,
                name: 'master',
            });
        } finally {
            status.stop();
        }
    },
    setupRepoBranchAccessRight: async (Gitlab, id, data) => {
        const status = new Spinner(`Initializing branch "${get(data, 'name')}" access rights on repository...`);
        status.start();
        try {
            await sleep(2000);
            await Gitlab.configureBranchAccessRightRepository({
                projectId: id,
                name: get(data, 'name'),
                push_access_level: get(data, 'push_access_level'),
                merge_access_level: get(data, 'merge_access_level'),
                unprotect_access_level: get(data, 'unprotect_access_level'),
            });
        } finally {
            status.stop();
        }
    },
};
