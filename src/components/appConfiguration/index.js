#!/usr/bin/env node
const { isEmpty } = require('lodash');
const { program } = require('commander');

const config = require('../../config');
const controller = require('./controller');
const inquirer = require('./inquirer');

module.exports = {
    appConfigurationInit: async () => {
        let answers = await inquirer.askAppGlobalConfiguration(config.getAsciiArt());
        if (!isEmpty(answers)) await controller.storeAppGlobalConfiguration(answers);
        if (program.configure) {
            answers = await inquirer.askProjectConfiguration();
            await controller.launchAction(answers);
        }
    },

    appInitialisation: () => config.getAsciiArt(),

};





