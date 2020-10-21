const ConfigStore = require('configstore');
const { get } = require('lodash');

const pkg = require('../package.json');

const conf = new ConfigStore(pkg.name);

module.exports = {
    clearConfigStore: () => {
        conf.clear();
    },
    setGitlabPersonalToken: (data) => {
        conf.set('gitlab.personal_token', get(data, 'personal_token'));
    },
    getStoredGitlabPersonalToken: () => ({ personal_token: conf.get('gitlab.personal_token') }),
    setRepositoryDefaultData: (data) => {
        conf.set('repository', {
            visibility: get(data, 'visibility'),
            namespace_id: get(data, 'namespace.id'),
        });
    },
    getStoredRepositoryDefaultData: () => ({
        visibility: conf.get('repository.visibility'),
        namespace_id: conf.get('repository.namespace_id'),
    }),
    setSkeletonRepositoryDefaultData: (data) => {
        conf.set(`skeletons.${[get(data, 'skeleton_project_name')]}`, {
            project_id: get(data, 'skeleton_project_id'),
            token: get(data, 'project_token'),
            branch: get(data, 'branch'),
        });
    },
    getStoredSkeletonRepositoryDefaultData: (projectName) => ({
        skeleton_project_id: conf.get(`skeletons.${projectName}.project_id`),
        project_token: conf.get(`skeletons.${projectName}.token`),
        branch: conf.get(`skeletons.${projectName}.branch`),
    }),
};
