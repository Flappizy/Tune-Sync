"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spotifyCookiesOptions = exports.stateCookiesOptions = exports.refreshTokenCookiesOptions = void 0;
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("config"));
exports.refreshTokenCookiesOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    expires: new Date(Date.now() + config_1.default.get('refreshExpiration') * 60 * 1000),
};
exports.stateCookiesOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    expires: new Date(Date.now() + 60 * 60 * 1000)
};
exports.spotifyCookiesOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    expires: new Date(Date.now() + 60 * 60 * 1000)
};
//# sourceMappingURL=customCookieOptions.js.map