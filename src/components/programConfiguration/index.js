#!/usr/bin/env node
const { get, isEmpty } = require('lodash');
const { program } = require('commander');
const chalk = require('chalk');
const pkg = require('../../../package.json');

const config = require('../../config');
const inquirer = require('./inquirer');

const { templateAddNewConfiguration, templateConfigurationDeletion } = require('../templateRepository');
const { userStorageRepositoryAddNewConfiguration, userStorageRepositoryConfigurationDeletion } = require('../userStorageRepository');


function storeAppGlobalConfiguration(data) {
    config.setAsciiArt(data);
}

async function menuAction(options) {
    const answers = await inquirer.askActionConfiguration();
    switch (get(answers, 'action')) {
        case 'add':
            if (options === 'storage') await userStorageRepositoryAddNewConfiguration();
            else if (options === 'template') await templateAddNewConfiguration();
            break;
        case 'delete':
            if (options === 'storage') await userStorageRepositoryConfigurationDeletion();
            else if (options === 'template') await templateConfigurationDeletion();
            break;
        case 'exit':
            process.exit();
            break;
        default:
            console.log(chalk.yellow(`Case ${get(answers, 'action')} not yet implemented`));
    }
    return answers;
}

async function resetConfiguration() {
    console.log(chalk.red('----- RESET ALL CONFIGURATIONS -----'));
    const answers = await inquirer.askResetConfigurationConfirmation();
    if (get(answers, 'confirm') === true) {
        config.clearConfigStore();
        console.log(chalk.green('Successful reset!'));
    }
}

async function menuConfiguration() {
    program.parse(process.argv);
    let answers = {};
    if (get(program, 'configure') === true) {
        answers = await inquirer.askAppGlobalConfiguration(config.getAsciiArt());
        if (!isEmpty(answers)) await storeAppGlobalConfiguration(answers);
        answers = await inquirer.askProgramConfiguration();
    }
    switch (true) {
        case get(answers, 'choice') === 'storage' || get(program, 'configure') === 'storage':
        case get(answers, 'choice') === 'template' || get(program, 'configure') === 'template':
            answers = { ...answers, ...await menuAction(get(answers, 'choice') || get(program, 'configure')) };
            break;
        case get(answers, 'choice') === 'reset' || get(program, 'configure') === 'reset':
            await resetConfiguration();
            break;
        case get(answers, 'choice') === 'exit':
            process.exit();
            break;
        default:
    }
    if (!isEmpty(get(answers, 'choice')) || !isEmpty(get(program, 'configure'))) await menuConfiguration();
}
module.exports = {
    programConfiguration: async () => {
        program.version(pkg.version);
        program.option('-c, --configure [type]', 'program configuration');
        await menuConfiguration();
    },



    programInit: () => config.getAsciiArt(),

};





