#!/usr/bin/env node
const { get } = require('lodash');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

// Messaging & Errors files
const error = require('./helpers/errors.json');

const files = require('./lib/files');
const gitlab = require('./lib/gitlab');
const repo = require('./lib/repo');

// clearing the terminal windows
clear();

// title app on ASCII
console.log(
    chalk.yellow(
        figlet.textSync('HelloMyBot', { horizontalLayout: 'full' }),
    ),
);

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
        const { id, name, url } = await repo.createRemoteRepo(Gitlab);

        // Lambda project Id : 12551231
        // HMB : oSdiazaxqgvAiv9mZ4bR
        // Set up local folder with skeleton repository
        await repo.skeletonRepoConfig(name);

        // Set up local repository and push to remote
        await repo.setupRepo(name, url);

        console.log(chalk.green('All done!'));
    } catch (err) {
        if (err) {
            console.log(err);
            console.log(chalk.red(get(err, 'message.message')));
        }
    }
};

run();
