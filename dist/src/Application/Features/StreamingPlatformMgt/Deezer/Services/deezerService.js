"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("config"));
const axios_1 = tslib_1.__importDefault(require("axios"));
class DeezerService {
    constructor() {
        this.appId = config_1.default.get('deezerAppId').toString();
        this.appSecret = config_1.default.get('deezerSecretKey').toString();
    }
    getDeezerUserAccessToken(code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = `https://connect.deezer.com/oauth/access_token.php?app_id=${this.appId}&secret=${this.appSecret}&code=${code}`;
            try {
                const { data } = yield axios_1.default.get(url);
                const match = data.match(/access_token=([^&]*)/);
                let accessToken = null;
                if (match && match[1]) {
                    accessToken = match[1];
                }
                return { access_token: accessToken };
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getDeezerUserId(access_token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = `https://api.deezer.com/user/me?access_token=${access_token}`;
            try {
                const { data } = yield axios_1.default.get(url);
                return data;
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getUserPlaylist(accesToken, page, perPage) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * perPage;
            const url = `https://api.deezer.com/user/me/playlists?access_token=${accesToken}&index=${offset}`;
            try {
                let { data } = yield axios_1.default.get(url);
                const playlists = data.data.map((item) => ({
                    description: item.title,
                    id: item.id,
                    imageUrl: item.picture,
                    name: item.title,
                    owner: item.creator.name,
                    tracks: {
                        url: item.tracklist,
                        total: item.nb_tracks
                    }
                }));
                const userLibrary = {
                    playLists: playlists,
                    accessToken: null,
                    refreshToken: null,
                    total: data.total
                };
                return userLibrary;
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
}
exports.default = new DeezerService();
//# sourceMappingURL=deezerService.js.map