"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.createToken = void 0;
const tslib_1 = require("tslib");
require("./LoadEnv");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const config_1 = tslib_1.__importDefault(require("config"));
const createToken = (payLoad, keyName, options) => {
    const secretKey = Buffer.from(config_1.default.get(keyName), 'base64').toString('ascii');
    return jsonwebtoken_1.default.sign(payLoad, secretKey, Object.assign(Object.assign({}, (options && options)), { algorithm: 'RS256' }));
};
exports.createToken = createToken;
const validateToken = (token, keyName) => {
    try {
        const secretKey = Buffer.from(config_1.default.get(keyName), 'base64').toString('ascii');
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.validateToken = validateToken;
//# sourceMappingURL=jwtHandler.js.map