#!/usr/bin/env node
const { get } = require('lodash');
const chalk = require('chalk');
const config = require('./config');
const { programConfiguration } = require('./components/programConfiguration');
const { templateSelection } = require('./components/templateRepository');
const {
    userProjectConfiguration, projectCreation, createRemoteRepo, pushInitialCommit,
} = require('./components/userProject');


const run = async () => {
    try {
        await programConfiguration();
        // Configure project
        await userProjectConfiguration();
        // Choose template
        await templateSelection();
        // Create repository
        await createRemoteRepo();
        // Create project from template
        await projectCreation();
        // Set up local repository and push to remote
        await pushInitialCommit();
        config.clearSpecificKey('current');
        console.log(chalk.green('All done!'));
    } catch (err) {
        if (err) {
            console.log(err);
            console.log(chalk.red(get(err, 'message.message')));
        }
    }
};
module.exports = { run };

