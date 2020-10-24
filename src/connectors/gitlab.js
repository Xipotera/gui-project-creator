const axios = require('axios');
const { get } = require('lodash');

class Gitlab {
    constructor(credentials) {
        this.url = get(credentials, 'url', 'https://gitlab.com/api/v4');
        this.token = get(credentials, 'personal_token');
    }

    async verifyPersonalToken() {
        const options = {
            method: 'get',
            url: `${this.url}/projects`,
            headers: { Authorization: `Bearer ${this.token}` },
            params: {
                owned: true,
                membership: true,
                per_page: 1,
                simple: true,
            },
            responseType: 'json',
        };

        try {
            const result = await axios(options);
            return require('../helpers/messages.json').TOKEN_IS_VALID;
        } catch (err) {
            const errorMessage = require('../helpers/ServerErrors')(err);
            throw errorMessage;
        }
    }

    async createRepository(data) {
        const options = {
            method: 'post',
            url: `${this.url}/projects`,
            headers: { Authorization: `Bearer ${this.token}` },
            data,
            responseType: 'json',
        };

        try {
            const result = await axios(options);
            return get(result, 'data');
        } catch (err) {
            const errorMessage = require('../helpers/ServerErrors')(err);
            throw errorMessage;
        }
    }

    async configureBranchRepository(data) {
        const options = {
            method: 'post',
            url: `${this.url}/projects/${get(data, 'projectId')}/repository/branches`,
            headers: { Authorization: `Bearer ${this.token}` },
            params: {
                branch: get(data, 'name'),
                ref: get(data, 'origin'),
            },
            responseType: 'json',
        };

        try {
            const result = await axios(options);
            return get(result, 'data');
        } catch (err) {
            console.log(err);
            const errorMessage = require('../helpers/ServerErrors')(err);
            throw errorMessage;
        }
    }

    /**
     * 0 => No access
     * 30 => Developer access
     * 40 => Maintainer access
     * 60 => Admin access
     * @param data
     * @returns {Promise<*>}
     */
    async configureBranchAccessRightRepository(data) {
        const options = {
            method: 'post',
            url: `${this.url}/projects/${get(data, 'projectId')}/protected_branches`,
            headers: { Authorization: `Bearer ${this.token}` },
            params: {
                name: get(data, 'name'),
                push_access_level: get(data, 'push_access_level', 30),
                merge_access_level: get(data, 'merge_access_level', 30),
                unprotect_access_level: get(data, 'unprotect_access_level', 40),
            },
            responseType: 'json',
        };

        try {
            const result = await axios(options);
            return get(result, 'data');
        } catch (err) {
            console.log(err);
            const errorMessage = require('../helpers/ServerErrors')(err);
            throw errorMessage;
        }
    }

    async unprotectMasterBranch(data) {
        const options = {
            method: 'delete',
            url: `${this.url}/projects/${get(data, 'projectId')}/protected_branches/${get(data, 'name')}`,
            headers: { Authorization: `Bearer ${this.token}` },
            responseType: 'json',
        };
        try {
            const result = await axios(options);
            return get(result, 'data');
        } catch (err) {
            const errorMessage = require('../helpers/ServerErrors')(err);
            throw errorMessage;
        }
    }

    async groupsRepository() {
        const options = {
            method: 'get',
            url: `${this.url}/groups`,
            headers: { Authorization: `Bearer ${this.token}` },
            responseType: 'json',
        };
        try {
            const result = await axios(options);
            return get(result, 'data');
        } catch (err) {
            const errorMessage = require('../helpers/ServerErrors')(err);
            throw errorMessage;
        }
    }

    async getProjects() {
        const options = {
            method: 'get',
            url: `${this.url}/projects?owned=true&membership=true&search=&visibility&per_page=1`,
            headers: { Authorization: `Bearer ${this.token}` },
            responseType: 'json',
        };
        try {
            const result = await axios(options);
            return get(result, 'data');
        } catch (err) {
            const errorMessage = require('../helpers/ServerErrors')(err);
            throw errorMessage;
        }
    }
}

module.exports = Gitlab;


