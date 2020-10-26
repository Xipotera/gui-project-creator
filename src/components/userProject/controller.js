const CLI = require('clui');
const { git } = require('cmd-executor');
const sleep = require('sleep-promise');
const shell = require('shelljs');


const { Spinner } = CLI;
const { get, sortBy } = require('lodash');
const { createRepository } = require('../../connectors/gitlab');


const config = require('../../config');


module.exports = {
    createGitlabRepository: async (data) => {
        const options = {
            name: get(data, 'name'),
            description: get(data, 'description'),
            visibility: get(data, 'visibility').toLowerCase(),
            namespace_id: get(data, 'namespaceId'),
        };

        const repository = await createRepository(get(data, 'token'), options);
        return {
            projectId: get(repository, 'id'),
            name: get(repository, 'name'),
            url: get(repository, 'ssh_url_to_repo'),
        };
    },

};
