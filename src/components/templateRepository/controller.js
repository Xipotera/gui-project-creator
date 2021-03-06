const CLI = require('clui');

const { Spinner } = CLI;
const { get } = require('lodash');


const chalk = require('chalk');
const tar = require('tar-fs');
const gunzip = require('gunzip-maybe');
const request = require('request');
const format = require('streaming-format');
const path = require('path');
const config = require('../../config');
const gitlab = require('../../connectors/gitlab');


module.exports = {
    verifyPersonalToken: async (data) => {
        try {
            await gitlab.verifyPersonalToken(get(data, 'token'));
            return true;
        } catch (err) {
            return false;
        }
    },

    saveConfiguration: (data) => {
        const template = {
            [get(data, 'name')]: {
                server: get(data, 'server'),
                visibility: get(data, 'visibility'),
                token: get(data, 'token'),
                id: get(data, 'id'),
                path: get(data, 'path'),
                branch: get(data, 'branch'),
                // eslint-disable-next-line max-len
                url: get(data, 'url') || get(data, 'server') === 'gitlab' ? 'https://gitlab.com/api' : 'https://github.com',
            },
        };
        config.setTemplateRepositoryDefaultData(template);
        console.log(chalk.green('Template project configuration saved!'));
        console.log(chalk.green('All done!'));
        process.exit();
    },

    deleteConfiguration: (answers) => {
        if (get(answers, 'confirm') === true) {
            config.clearSpecificKey(`templates.${get(answers, 'template')}`);
            console.log(chalk.green(`Template project '${get(answers, 'template')}' configuration deleted!`));
        }
        console.log(chalk.green('All done!'));
        process.exit();
    },

    getTemplateRepository: async ({
        projectId,
        token,
        branchName,
        name,
        url,
        template,
        server,
        pathRepository,
    }) => {
        let gzipStream;
        const failedHttp = function (response) {
            if (response.statusCode !== 200) {
                console.log(`Fetch failed! Status code: ${response.statusCode}`);
                process.exit(4);
            }
        };

        const queryRequest = {};
        switch (server.toLowerCase()) {
            case 'gitlab':
                if (token) {
                    queryRequest.headers = {
                        Authorization: `Bearer ${token}`,
                    };
                }
                queryRequest.url = `${url}/v4/projects/${projectId}/repository/archive?sha=${branchName}`;
                break;
            case 'github':
                queryRequest.headers = {
                    Authorization: `token ${token}`,
                };
                queryRequest.url = `${url}/${pathRepository}/archive/${branchName}.tar.gz`;
                break;
            default:
                console.error(`Case ${server} is not yet implemented!`);
        }

        gzipStream = request(queryRequest);
        gzipStream.on('response', failedHttp);

        const formatter = function (stream) {
            const def = {};
            def.name = name;

            return stream.pipe(format((name) => def[name] || `{{${name}}}`));
        };


        await gzipStream
            .pipe(gunzip())
            .pipe(tar.extract(name, { strip: 1, mapStream: formatter }))
            .on('finish', () => true);
    },
};
