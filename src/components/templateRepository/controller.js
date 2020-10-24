const CLI = require('clui');

const { Spinner } = CLI;
const { get, sortBy } = require('lodash');

const config = require('../../config');

module.exports = {

    saveConfiguration: async (data) => {
        const template = {
            [get(data, 'name')]: {
                server: get(data, 'server'),
                visibilty: get(data, 'visibility'),
                token: get(data, 'token'),
                id: get(data, 'id'),
            },
        };
        // Store Namespace ID and visibility
        config.setTemplateRepositoryDefaultData(template);
        return true;
    },


    templateRepoDownload: async (projectName) => {
        const status = new Spinner('Initializing project repository with template files...');
        status.start();

        const data = config.getStoredTemplateRepositoryDefaultData('aws-template');

        try {
            await getTemplateRepository({
                projectId: get(data, 'template_project_id'),
                token: get(data, 'project_token'),
                branchName: get(data, 'branch'),
                projectName,
            });
        } finally {
            status.stop();
        }
    },
};
