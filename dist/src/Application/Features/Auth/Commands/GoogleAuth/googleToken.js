"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleOauthToken = void 0;
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("config"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const qs_1 = tslib_1.__importDefault(require("qs"));
const getGoogleOauthToken = ({ code }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const rootURl = "https://oauth2.googleapis.com/token";
    const options = {
        code,
        client_id: Buffer.from(config_1.default.get('googleOauthClientId'), 'base64').toString('ascii'),
        client_secret: Buffer.from(config_1.default.get('googleOauthClientSecret'), 'base64').toString('ascii'),
        redirect_uri: config_1.default.get('GOOGLE_OAUTH_REDIRECT'),
        grant_type: "authorization_code",
    };
    try {
        const { data } = yield axios_1.default.post(rootURl, qs_1.default.stringify(options), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return data;
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.getGoogleOauthToken = getGoogleOauthToken;
//# sourceMappingURL=googleToken.js.map