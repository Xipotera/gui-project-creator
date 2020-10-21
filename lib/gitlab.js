const CLI = require('clui');

const { Spinner } = CLI;
const { get, isEmpty } = require('lodash');
const inquirer = require('./inquirer');

const GitlabClass = require('../connectors/gitlab');

const config = require('./configStorage');


async function getGitlabServicesAccess() {
    // Fetch personal token from config store
    let credentials = config.getStoredGitlabPersonalToken();
    // No token found, ask personal token to access Gitlab account
    if (isEmpty(get(credentials, 'personal_token'))) {
        credentials = await inquirer.askGitlabPersonalToken();
    }
    const status = new Spinner('Authenticating you, please wait...');
    status.start();


    try {
        const Gitlab = new GitlabClass(credentials);
        const response = await Gitlab.verifyPersonalToken();
        if (get(response, 'code') === 'TOKEN_IS_VALID') {
            config.setGitlabPersonalToken(credentials);
            return Gitlab;
        }
    } finally {
        status.stop();
    }
}

module.exports = { getGitlabServicesAccess };
