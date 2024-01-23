"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.createToken = void 0;
const tslib_1 = require("tslib");
require("../../LoadEnv");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const config_1 = tslib_1.__importDefault(require("config"));
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const createToken = (payLoad, keyName) => {
    const secretKey = Buffer.from(config_1.default.get(keyName), 'base64').toString('ascii');
    const expiration = keyName === 'secretKey' ?
        config_1.default.get('expiration') : config_1.default.get('refreshExpiration');
    ;
    logger_1.default.info(expiration);
    console.log(expiration);
    return jsonwebtoken_1.default.sign(payLoad, secretKey, {
        expiresIn: expiration,
        algorithm: 'HS256',
    });
};
exports.createToken = createToken;
const validateToken = (token, keyName) => {
    try {
        const secretKey = Buffer.from(config_1.default.get(keyName), 'base64').toString('ascii');
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return decoded;
    }
    catch (error) {
        logger_1.default.info(error);
        return null;
    }
};
exports.validateToken = validateToken;
//# sourceMappingURL=jwtHandler.js.map