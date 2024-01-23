"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleUser = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
function getGoogleUser({ id_token, access_token, }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            });
            return data;
        }
        catch (err) {
            console.log(err);
            throw Error(err);
        }
    });
}
exports.getGoogleUser = getGoogleUser;
//# sourceMappingURL=googleUser.js.map