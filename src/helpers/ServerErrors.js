const { get } = require('lodash');

const { StatusCodes } = require('http-status-codes');
const errors = require('./errors.json');

module.exports = (err) => {
    let errorStatusCode = 500;
    if (err.statusCode) { errorStatusCode = err.statusCode; }
    if (get(err, 'response.status')) { errorStatusCode = get(err, 'response.status'); }


    switch (errorStatusCode) {
        case 401:
            return { status: StatusCodes.UNAUTHORIZED, message: err.error || errors.RISE_WRONG_TOKEN };
        case 404:
            return { status: StatusCodes.NOT_FOUND, message: err.error || errors.REQUEST_NOT_FOUND };
        case 400:
            return { status: StatusCodes.BAD_REQUEST, message: err.error || errors.REMOTE_REPOSITORY_ALREADY_EXIST };
        case 500:
            return { status: StatusCodes.INTERNAL_SERVER_ERROR, message: err.error || errors.INTERNAL_SERVER_ERROR };
        default:
            return { status: errorStatusCode, message: err.message };
    }
};
