#!/usr/bin/env node
const { get } = require('lodash');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

// Messaging & Errors files
const { program } = require('commander');
const error = require('./helpers/errors.json');

const files = require('./lib/files');
const gitlab = require('./lib/gitlab');
const repo = require('./lib/repo');
// clearing the terminal windows
clear();

program.version('0.0.1');
program
    .option('-c, --configure <type>', 'configure')
    .on('--help', () => {
        console.log('');
        console.log('Example call:');
        console.log('  $ custom-help --help');
    });
program.parse(process.argv);

console.log(
    chalk.yellow(
        figlet.textSync('HelloMyBot', { horizontalLayout: 'full' }),
    ),
);

if (program.configure) {
    const config = require('./lib/configStorage');
    config.clearConfigStore();
    console.log(chalk.red('config was cleared'));
    process.exit(1);
} else {
    // title app on ASCII
    /**
     * @description: first verifying if the current folder already have a .git folder
     * case is true a gir repository already exist then exit
     * else continue
     */
    if (files.directoryExists('.git')) {
        console.log(chalk.red(get(error, 'CURRENT_ALREADY_GIT_REPOSITORY')));
        process.exit();
    }

    const run = async () => {
        try {
            // Verify Gitlab Authentication
            const Gitlab = await gitlab.getGitlabServicesAccess();
            // Create remote repository
            const { projectId, name, url } = await repo.createRemoteRepo(Gitlab);


            // Set up local folder with skeleton repository
            await repo.skeletonRepoConfig(name);

            // Set up local repository and push to remote
            await repo.setupRepo(name, url);

            // Set up repository branch
            const branchs = [
                { new: 'develop', origin: 'master' },
                { new: 'prod', origin: 'develop' },
            ];

            // eslint-disable-next-line no-restricted-syntax
            for (const branchInfo of branchs) {
                // eslint-disable-next-line no-await-in-loop
                await repo.setupRepoBranch(Gitlab, projectId, branchInfo);
            }

            await repo.setupRepoBranchUnprotectMaster(Gitlab, projectId);
            const branchsRightAccess = [
                {
                    name: 'master', push_access_level: 0, merge_access_level: 0, unprotect_access_level: 40,
                },
                {
                    name: 'develop', push_access_level: 30, merge_access_level: 30, unprotect_access_level: 40,
                },
                {
                    name: 'prod', push_access_level: 30, merge_access_level: 30, unprotect_access_level: 40,
                },
            ];

            // eslint-disable-next-line no-restricted-syntax
            for (const branchInfo of branchsRightAccess) {
                // eslint-disable-next-line no-await-in-loop
                await repo.setupRepoBranchAccessRight(Gitlab, projectId, branchInfo);
            }


            console.log(chalk.green('All done!'));
        } catch (err) {
            if (err) {
                console.log(chalk.red(get(err, 'message.message')));
            }
        }
    };

    run();
}
