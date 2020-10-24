#!/usr/bin/env node

const tar = require('tar-fs');
const gunzip = require('gunzip-maybe');
const request = require('request');
const format = require('streaming-format');

module.exports = {
    getTemplateRepository: async ({
        projectId, token, branchName, projectName,
    }) => {
        const failedHttp = function (response) {
            if (response.statusCode !== 200) {
                console.log(`Fetch failed! Status code: ${response.statusCode}`);
                process.exit(4);
            }
        };


        const queryRequest = {
            url: `https://gitlab.com/api/v4/projects/${projectId}/repository/archive?sha=${branchName}`,

            headers: {
                Authorization: `Bearer ${token}`,
            },
        };


        const gzipStream = request(queryRequest).on('response', failedHttp);
        const path = require('path');
        const name = projectName && path.basename(projectName);
        const formatter = function (stream) {
            // eslint-disable-next-line no-shadow
            return stream.pipe(format((name) => `{{${name}}}`));
        };


        return gzipStream
            .pipe(gunzip())
            .pipe(tar.extract(name, { strip: 1, mapStream: formatter }))
            .on('finish', () => 'eo');
    },
};
