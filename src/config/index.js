const ConfigStore = require('configstore');
const { get, isEmpty } = require('lodash');

const pkg = require('../../package.json');

const conf = new ConfigStore(pkg.name);

module.exports = {
    clearConfigStore: () => {
        conf.clear();
    },
    clearSpecificKey: (key) => {
        conf.delete(key);
    },
    setAsciiArt: (data) => {
        conf.set('app.title', get(data, 'title'));
    },
    getAsciiArt: () => ({ title: conf.get('app.title') }),

    setGitlabPersonalToken: (data) => {
        conf.set('gitlab.personal_token', get(data, 'personal_token'));
    },
    getStoredGitlabPersonalToken: () => ({ personal_token: conf.get('gitlab.personal_token') }),
    setRepositoryDefaultData: (data) => {
        conf.set('repository.visibility', get(data, 'visibility'));
        if (isEmpty(get(data, 'namespace.id'))) {
            conf.delete('repository.namespace_id');
        } else {
            conf.set('repository.namespace_id', get(data, 'namespace.id'));
        }
    },
    getStoredRepositoryDefaultData: () => ({
        visibility: conf.get('repository.visibility'),
        namespace_id: conf.get('repository.namespace_id'),
    }),
    // Store a new template project configuration
    setTemplateRepositoryDefaultData: (data) => {
        conf.set('templates', { ...conf.get('templates'), ...data });
    },
    // Return all stored templates
    getTemplatesConfiguration: () => ({
        templates: conf.get('templates'),
    }),
    getTemplatesConfigurationByName: (templateName) => conf.get(`templates.${templateName}`),
    // Return all stored user storage repository
    getStorageConfiguration: () => ({
        storages: conf.get('storages'),
    }),
    setStorageDefaultData: (data) => {
        conf.set('storages', { ...conf.get('storages'), ...data });
    },
    getStorageConfigurationByName: (storageName) => conf.get(`storages.${storageName}`),

    setProjectDefault: (data) => {
        conf.set('lastProject', { ...conf.get('lastProject'), ...data });
    },
    getProjectDefault: () => conf.get('lastProject'),
    setCurrentProject: (data) => {
        conf.set('current', { ...conf.get('current'), ...data });
    },
    getCurrentProject: () => conf.get('current'),
};
