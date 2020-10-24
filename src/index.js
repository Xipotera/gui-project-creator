#!/usr/bin/env node
const { get, isEmpty } = require('lodash');
const chalk = require('chalk');

// Messaging & Errors files
const { program } = require('commander');
const gitlab = require('./lib/gitlab');
const repo = require('./lib/repo');

const { appConfigurationInit } = require('./components/appConfiguration');
const { templateConfigurationInit } = require('./components/templateRepository');
const { UserRepoController } = require('./components/userRepository');


const run = async () => {
    try {
        await appConfigurationInit();
        // Templates repositories configuration
        await templateConfigurationInit();

        // // Verify Gitlab Authentication
        // const Gitlab = await gitlab.getGitlabServicesAccess();
        //
        //
        // // Create remote repository
        // const { projectId, name, url } = await repo.createRemoteRepo(Gitlab);
        // // Set up local folder with template repository
        // await UserRepoController.templateRepoDownload(name);
        //
        // // Set up local repository and push to remote
        // await repo.setupRepo(name, url);
        //
        // // Set up repository branch
        // const branchs = [
        //     { new: 'develop', origin: 'master' },
        //     { new: 'prod', origin: 'develop' },
        // ];
        //
        // // eslint-disable-next-line no-restricted-syntax
        // for (const branchInfo of branchs) {
        //     // eslint-disable-next-line no-await-in-loop
        //     await repo.setupRepoBranch(Gitlab, projectId, branchInfo);
        // }
        //
        // await repo.setupRepoBranchUnprotectMaster(Gitlab, projectId);
        // const branchsRightAccess = [
        //     {
        //         name: 'master', push_access_level: 0, merge_access_level: 0, unprotect_access_level: 40,
        //     },
        //     {
        //         name: 'develop', push_access_level: 30, merge_access_level: 30, unprotect_access_level: 40,
        //     },
        //     {
        //         name: 'prod', push_access_level: 30, merge_access_level: 30, unprotect_access_level: 40,
        //     },
        // ];
        //
        // // eslint-disable-next-line no-restricted-syntax
        // for (const branchInfo of branchsRightAccess) {
        //     // eslint-disable-next-line no-await-in-loop
        //     await repo.setupRepoBranchAccessRight(Gitlab, projectId, branchInfo);
        // }


        console.log(chalk.green('All done!'));
    } catch (err) {
        if (err) {
            console.log(err);
            console.log(chalk.red(get(err, 'message.message')));
        }
    }
};
module.exports = { run };

