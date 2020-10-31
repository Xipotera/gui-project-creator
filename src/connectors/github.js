const { get } = require('lodash');

const { request } = require('@octokit/request');

module.exports = {
    verifyPersonalToken: async (token) => {
        try {
            const result = await request('GET /', {
                headers: {
                    authorization: `token ${token}`,
                },

            });
            return require('../helpers/messages.json').TOKEN_IS_VALID;
        } catch (err) {
            const errorMessage = require('../helpers/ServerErrors')(err);
            throw errorMessage;
        }
    },
    getProjectByPath: async (token, path) => {
        try {
            const result = await request(`GET /repos/${path}`, {
                headers: {
                    authorization: `token ${token}`,
                },

            });
            return result.data;
        } catch (err) {
            console.log(err);
            const errorMessage = require('../helpers/ServerErrors')(err);
            throw errorMessage;
        }
    },



    // getProjectById: async (token, projectId) => {
    //     const options = {
    //         method: 'get',
    //         url: `${url}/projects/${projectId}`,
    //         headers: { Authorization: `Bearer ${token}` },
    //         responseType: 'json',
    //     };
    //     try {
    //         const result = await axios(options);
    //         return get(result, 'data');
    //     } catch (err) {
    //         const errorMessage = require('../helpers/ServerErrors')(err);
    //         throw errorMessage;
    //     }
    // },
    getBranchRepository: async (token, path) => {
        try {
            const result = await request(`GET /repos/${path}/branches`, {
                headers: {
                    authorization: `token ${token}`,
                },

            });
            return result.data.map((branch) => get(branch, 'name'));
        } catch (err) {
            console.log(err);
            const errorMessage = require('../helpers/ServerErrors')(err);
            throw errorMessage;
        }
    },
    //
    // groupsRepository: async (token) => {
    //     const options = {
    //         method: 'get',
    //         url: `${url}/groups`,
    //         headers: { Authorization: `Bearer ${token}` },
    //         responseType: 'json',
    //     };
    //     try {
    //         const result = await axios(options);
    //         return get(result, 'data');
    //     } catch (err) {
    //         const errorMessage = require('../helpers/ServerErrors')(err);
    //         throw errorMessage;
    //     }
    // },
    //
    // createRepository: async (token, data) => {
    //     const options = {
    //         method: 'post',
    //         url: `${url}/projects`,
    //         headers: { Authorization: `Bearer ${token}` },
    //         data,
    //         responseType: 'json',
    //     };
    //
    //     try {
    //         const result = await axios(options);
    //         return get(result, 'data');
    //     } catch (err) {
    //         const errorMessage = get(err, 'data');
    //         throw errorMessage;
    //     }
    // },



    // configureBranchRepository: async (data) => {
    //     const options = {
    //         method: 'post',
    //         url: `${url}/projects/${get(data, 'projectId')}/repository/branches`,
    //         headers: { Authorization: `Bearer ${this.token}` },
    //         params: {
    //             branch: get(data, 'name'),
    //             ref: get(data, 'origin'),
    //         },
    //         responseType: 'json',
    //     };
    //
    //     try {
    //         const result = await axios(options);
    //         return get(result, 'data');
    //     } catch (err) {
    //         console.log(err);
    //         const errorMessage = require('../helpers/ServerErrors')(err);
    //         throw errorMessage;
    //     }
    // },
    //
    // /**
    //  * 0 => No access
    //  * 30 => Developer access
    //  * 40 => Maintainer access
    //  * 60 => Admin access
    //  * @param data
    //  * @returns {Promise<*>}
    //  */
    // configureBranchAccessRightRepository: async (data) => {
    //     const options = {
    //         method: 'post',
    //         url: `${url}/projects/${get(data, 'projectId')}/protected_branches`,
    //         headers: { Authorization: `Bearer ${this.token}` },
    //         params: {
    //             name: get(data, 'name'),
    //             push_access_level: get(data, 'push_access_level', 30),
    //             merge_access_level: get(data, 'merge_access_level', 30),
    //             unprotect_access_level: get(data, 'unprotect_access_level', 40),
    //         },
    //         responseType: 'json',
    //     };
    //
    //     try {
    //         const result = await axios(options);
    //         return get(result, 'data');
    //     } catch (err) {
    //         console.log(err);
    //         const errorMessage = require('../helpers/ServerErrors')(err);
    //         throw errorMessage;
    //     }
    // },
    //
    // unprotectMasterBranch: async (data) => {
    //     const options = {
    //         method: 'delete',
    //         url: `${url}/projects/${get(data, 'projectId')}/protected_branches/${get(data, 'name')}`,
    //         headers: { Authorization: `Bearer ${this.token}` },
    //         responseType: 'json',
    //     };
    //     try {
    //         const result = await axios(options);
    //         return get(result, 'data');
    //     } catch (err) {
    //         const errorMessage = require('../helpers/ServerErrors')(err);
    //         throw errorMessage;
    //     }
    // },
    //

    //
    // getProjects: async () => {
    //     const options = {
    //         method: 'get',
    //         url: `${url}/projects?owned=true&membership=true&search=&visibility&per_page=1`,
    //         headers: { Authorization: `Bearer ${this.token}` },
    //         responseType: 'json',
    //     };
    //     try {
    //         const result = await axios(options);
    //         return get(result, 'data');
    //     } catch (err) {
    //         const errorMessage = require('../helpers/ServerErrors')(err);
    //         throw errorMessage;
    //     }
    // },

};



