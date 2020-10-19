const axios = require('axios');
const { get } = require('lodash');

class Gitlab {
    constructor(credentials) {
        this.url = get(credentials, 'url', 'https://gitlab.com/api/v4/projects');
        this.token = get(credentials, 'personal_token');
    }

    async verifyPersonalToken() {
        const options = {
            method: 'get',
            url: this.url,
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
            url: this.url,
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
}

module.exports = Gitlab;


