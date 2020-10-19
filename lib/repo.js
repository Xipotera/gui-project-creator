const CLI = require('clui');
const { git } = require('cmd-executor');
const sleep = require('sleep-promise');
const shell = require('shelljs');


const { Spinner } = CLI;
const { get } = require('lodash');
const inquirer = require('./inquirer');

const { getSkeletonRepository } = require('./skeleton');

const config = require('./configStorage');

module.exports = {
    createRemoteRepo: async (Gitlab) => {
        const storedData = config.getStoredRepositoryDefaultData();
        const answers = await inquirer.askRepoDetails(storedData);
        const data = {
            name: get(answers, 'name'),
            description: get(answers, 'description'),
            visibility: get(answers, 'visibility', get(storedData, 'visibility')),
            namespace_id: get(answers, 'namespace_id', get(storedData, 'namespace_id')),
        };
        const status = new Spinner('Creating remote repository...');
        status.start();

        try {
            const repository = await Gitlab.createRepository(data);
            // Store Namespace ID and visibility
            config.setRepositoryDefaultData(repository);
            return {
                id: get(repository, 'id'),
                name: get(repository, 'name'),
                url: get(repository, 'ssh_url_to_repo'),
            };
        } finally {
            status.stop();
        }
    },

    skeletonRepoConfig: async (projectName) => {
        const storedData = config.getStoredSkeletonRepositoryDefaultData('aws-skeleton');
        const answers = await inquirer.askSkeletonRepositoryDetails(storedData);
        const data = {
            skeleton_project_name: 'aws-skeleton',
            server: 'gitlab',
            skeleton_project_id: get(answers, 'skeleton_project_id', get(storedData, 'skeleton_project_id')),
            project_token: get(answers, 'project_token', get(storedData, 'project_token')),
            branch: 'master',
        };

        // Store Namespace ID and visibility
        config.setSkeletonRepositoryDefaultData(data);


        const status = new Spinner('Initializing project repository with skeleton files...');
        status.start();

        try {
            await getSkeletonRepository({
                projectId: get(data, 'skeleton_project_id'),
                token: get(data, 'project_token'),
                branchName: get(data, 'branch'),
                projectName,
            });
        } finally {
            status.stop();
        }
    },
    setupRepo: async (folder, url) => {
        const status = new Spinner('Initializing local repository and pushing to remote...');
        status.start();

        url = url.replace('gitlab.com', 'gitlab.com-home');

        try {
            await sleep(2000);
            await shell.cd(`${folder}`);
            await shell.git.init();
            await git.add('./*');
            await git.remote.add('origin', url);
            await git.commit('-m "Initial commit"');
            await git.push('origin', 'master');
        } finally {
            status.stop();
        }
    },
};
