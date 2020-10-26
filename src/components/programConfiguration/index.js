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

async function templateMenuAction() {
    console.log('templateMenuAction');
    const answers = await inquirer.askActionConfiguration();
    switch (get(answers, 'action')) {
        case 'add':
            await templateAddNewConfiguration();
            break;
        case 'delete':
            await templateConfigurationDeletion();


            break;
        default:
            console.log(chalk.yellow(`Case ${get(answers, 'action')} not yet implemented`));
    }
    return answers;
}

async function userStorageRepositoryMenuAction() {
    console.log('userStorageRepositoryMenuAction');
    const answers = await inquirer.askActionConfiguration();
    switch (get(answers, 'action')) {
        case 'add':
            await userStorageRepositoryAddNewConfiguration();
            break;
        case 'delete':
            await userStorageRepositoryConfigurationDeletion();


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
    console.log(chalk.green('All done!'));
    process.exit();
}

module.exports = {
    programConfiguration: async () => {
        program.version(pkg.version);
        program.option('-c, --configure [type]', 'program configuration');
        program.parse(process.argv);

        let answers = {};
        switch (true) {
            case (get(program, 'configure') === true):
                answers = await inquirer.askAppGlobalConfiguration(config.getAsciiArt());
                if (!isEmpty(answers)) await storeAppGlobalConfiguration(answers);
                answers = await inquirer.askProgramConfiguration();
                switch (get(answers, 'choice')) {
                    case 'user_storage_repository':
                        answers = { ...answers, ...await userStorageRepositoryMenuAction() };
                        break;
                    case 'templates':
                        answers = { ...answers, ...await templateMenuAction() };
                        break;
                    case 'reset':
                        await resetConfiguration();
                        break;
                    default:
                        process.exit();
                }
                break;
            case get(program, 'configure') === 'reset':
                await resetConfiguration();
                break;
            case get(program, 'configure') === 'storage':
                answers = { ...answers, ...await userStorageRepositoryMenuAction() };
                break;
            case get(program, 'configure') === 'template':
                console.log('specific configuration');
                answers = { ...answers, ...await templateMenuAction() };

                break;
            default:
        }
    },



    programInit: () => config.getAsciiArt(),

};





