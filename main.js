#!/usr/bin/env node

const { get } = require('lodash');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

// Messaging & Errors files

const { program } = require('commander');
const error = require('./src/helpers/errors.json');
const { run } = require('./src/index');

const files = require('./src/utils/files');

const { appInitialisation } = require('./src/components/appConfiguration');



// clearing the terminal windows
clear();

program.version('0.0.1');
program
    .option('-c, --configure', 'configure');
program.parse(process.argv);


const app = appInitialisation();
console.log(
    chalk.yellow(
        figlet.textSync(get(app, 'title', 'Starter'), {
            horizontalLayout: 'full',
        }),
    ),
);


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
run();
