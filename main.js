#!/usr/bin/env node
const { get } = require('lodash');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const error = require('./src/helpers/errors.json');
const { run } = require('./src/index');
const files = require('./src/utils/files');
const { programInit } = require('./src/components/programConfiguration');

// clearing the terminal windows
clear();

// title program on ASCII
const app = programInit();
console.log(
    chalk.yellow(
        figlet.textSync(get(app, 'title', 'Starter'), {
            horizontalLayout: 'full',
        }),
    ),
);


/**
 * @description: first verifying if the current folder already have a .git folder
 * case is true a git repository already exist then exit
 * else continue
 */
if (files.directoryExists('.git')) {
    console.log(chalk.red(get(error, 'CURRENT_ALREADY_GIT_REPOSITORY')));
    process.exit();
}
run();
