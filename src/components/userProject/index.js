const CLI = require('clui');

const { Spinner } = CLI;

const { get } = require('lodash');
const sleep = require('sleep-promise');
const { git } = require('cmd-executor');
const shell = require('shelljs');
const inquirer = require('./inquirer');
const config = require('../../config');

const { getTemplateRepository } = require('../templateRepository/controller');
const { createGitlabRepository } = require('./controller');


module.exports = {
    userProjectConfiguration: async () => {
        let answers = await inquirer.askProjectConfiguration();
        const data = { ...config.getProjectDefault(), ...config.getStorageConfiguration() };
        answers = { ...answers, ...await inquirer.askProjectStorage(data) };
        switch (get(answers, 'server')) {
            case 'none':
                break;
            default:
                answers = { ...answers, ...await inquirer.askProjectStorageVisibility(data) };
        }

        // Store last default config`
        config.setProjectDefault({
            storage: get(answers, 'server'),
            visibility: get(answers, 'visibility'),
        });
        config.setCurrentProject(
            {
                name: get(answers, 'name'),
                description: get(answers, 'description'),

            },
        );
    },
    createRemoteRepo: async () => {
        const project = { ...config.getProjectDefault(), ...config.getCurrentProject() };
        if (['none'].includes(get(project, 'storage'))) return true;
        const storage = config.getStorageConfigurationByName(get(project, 'storage'));
        const status = new Spinner(`Creating "${get(project, 'name')}" remote repository...`);
        status.start();
        try {
            let repository;
            switch (get(storage, 'server')) {
                case 'gitlab':
                    repository = await createGitlabRepository({ ...project, ...storage });
                    config.setCurrentProject(
                        {
                            ...config.getCurrentProject(),
                            ...{ repository },
                        },
                    );
                    break;
                default:
            }
            await sleep(1000);
        } finally {
            status.stop();
        }
    },
    projectCreation: async () => {
        const project = { ...config.getProjectDefault(), ...config.getCurrentProject() };
        const status = await new Spinner('Initializing project with template...');
        status.start();
        const template = config.getTemplatesConfigurationByName(get(project, 'template'));
        try {
            await getTemplateRepository({
                name: get(project, 'name'),
                projectId: get(template, 'id'),
                token: get(template, 'token'),
                branchName: get(template, 'branch'),
                url: get(template, 'url'),
                template: get(project, 'template'),
            });
            await sleep(1000);
        } finally {
            status.stop();
        }
    },
    pushInitialCommit: async () => {
        const project = { ...config.getProjectDefault(), ...config.getCurrentProject() };
        if (['none'].includes(get(project, 'storage'))) return true;
        const status = new Spinner('Initializing local repository and pushing to remote...');
        status.start();

        try {
            await shell.cd(`${get(project, 'name')}`);
            await sleep(1000);
            await git.init();
            await git.add('./*');
            await git.remote.add('origin', get(project, 'repository.url'));
            await git.commit('-m "Initial commit"');
            await git.push('origin', 'master');
        } finally {
            status.stop();
        }
    },
};
