"use strict";
var _SpotifyService_instances, _SpotifyService_getNewAccessToken, _SpotifyService_getPlaylist;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("config"));
const qs_1 = tslib_1.__importDefault(require("qs"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const http_status_1 = require("http-status");
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
class SpotifyService {
    constructor() {
        _SpotifyService_instances.add(this);
        this.clientId = config_1.default.get('spotifyClientId').toString();
        this.clientSecret = config_1.default.get('spotifyClientSecret').toString();
    }
    getSpotifyUserAccessAndRefreshToken(code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')
                },
                form: {
                    grant_type: 'authorization_code',
                    redirect_uri: config_1.default.get('spotifyRedirectURI'),
                    code: code
                },
                json: true
            };
            logger_1.default.info(authOptions.headers);
            try {
                const { data } = yield axios_1.default.post(authOptions.url, qs_1.default.stringify(authOptions.form), { headers: authOptions.headers });
                return data;
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getUserProfileData(accessToken) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const authOptions = {
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                json: true
            };
            try {
                const { data } = yield axios_1.default.get(authOptions.url, { headers: authOptions.headers });
                return data;
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getUserPlaylist(accessToken, refreshToken, userId, page, perPage) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * perPage;
            let newTokens = null;
            if (!accessToken || accessToken === undefined) {
                newTokens = yield tslib_1.__classPrivateFieldGet(this, _SpotifyService_instances, "m", _SpotifyService_getNewAccessToken).call(this, refreshToken);
                accessToken = newTokens.access_token;
            }
            const authOptions = {
                url: `https://api.spotify.com/v1/users/${userId}/playlists?offset=${offset}&limit=${perPage}`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                json: true
            };
            try {
                let { data, status } = yield axios_1.default.get(authOptions.url, { headers: authOptions.headers });
                if (status === http_status_1.UNAUTHORIZED) {
                    newTokens = yield tslib_1.__classPrivateFieldGet(this, _SpotifyService_instances, "m", _SpotifyService_getNewAccessToken).call(this, refreshToken);
                    authOptions.headers.Authorization = `Bearer ${newTokens.access_token}`;
                    data = yield axios_1.default.get(authOptions.url, { headers: authOptions.headers });
                }
                const playlists = data.items.map((item) => ({
                    description: item.description,
                    id: item.id,
                    imageUrl: item.images[0].url,
                    name: item.name,
                    owner: item.owner.display_name,
                    snapshotId: item.snapshot_id,
                    tracks: {
                        url: item.tracks.href,
                        total: item.tracks.total
                    }
                }));
                const userLibrary = {
                    playLists: playlists,
                    accessToken: newTokens !== null ? newTokens.access_token : null,
                    refreshToken: newTokens !== null ? newTokens.refresh_token : null,
                    total: data.total
                };
                return userLibrary;
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getPlayListTracks(playlistDetails, refreshToken, page, perPage) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            playlistDetails = yield tslib_1.__classPrivateFieldGet(this, _SpotifyService_instances, "m", _SpotifyService_getPlaylist).call(this, playlistDetails.playlistId, playlistDetails.accessToken, refreshToken);
            logger_1.default.info(playlistDetails);
            const offset = (page - 1) * perPage;
            const authOptions = {
                url: `https://api.spotify.com/v1/playlists/${playlistDetails.playlistId}/tracks?offset=${offset}&limit=${perPage}`,
                headers: {
                    'Authorization': `Bearer ${playlistDetails.accessToken}`,
                },
                json: true
            };
            try {
                let { data } = yield axios_1.default.get(authOptions.url, { headers: authOptions.headers });
                const tracks = data.items.map((item) => ({
                    artist: item.artists.reduce((accumulator, artist) => accumulator + artist.name + ', ', ''),
                    nameOfTrack: item.name,
                    sourceIdOfTrack: item.id
                }));
                const playlistDto = {
                    name: playlistDetails.name,
                    description: playlistDetails.description,
                    imageUrl: playlistDetails.imageURL,
                    tracks: tracks,
                    accessToken: playlistDetails.accessToken
                };
                return playlistDto;
            }
            catch (error) {
                logger_1.default.info(error.response.data);
                throw new Error(error);
            }
        });
    }
}
_SpotifyService_instances = new WeakSet(), _SpotifyService_getNewAccessToken = function _SpotifyService_getNewAccessToken(refreshToken) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')
            },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            },
            json: true
        };
        try {
            const { data } = yield axios_1.default.post(authOptions.url, qs_1.default.stringify(authOptions.form), { headers: authOptions.headers });
            return data;
        }
        catch (err) {
            logger_1.default.info(err.response.data);
            throw new Error(err.response.data);
        }
    });
}, _SpotifyService_getPlaylist = function _SpotifyService_getPlaylist(playlistId, accessToken, refreshToken) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let newTokens = null;
        const authOptions = {
            url: `https://api.spotify.com/v1/playlists/${playlistId}?fields=description,name,id,images`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            json: true
        };
        try {
            if (!accessToken || accessToken === undefined) {
                newTokens = yield tslib_1.__classPrivateFieldGet(this, _SpotifyService_instances, "m", _SpotifyService_getNewAccessToken).call(this, refreshToken);
                accessToken = newTokens.access_token;
            }
            let { data, status } = yield axios_1.default.get(authOptions.url, { headers: authOptions.headers });
            logger_1.default.info(`Error: ${status}`);
            if (status === http_status_1.UNAUTHORIZED) {
                newTokens = yield tslib_1.__classPrivateFieldGet(this, _SpotifyService_instances, "m", _SpotifyService_getNewAccessToken).call(this, refreshToken);
                authOptions.headers.Authorization = `Bearer ${newTokens.access_token}`;
                data = yield axios_1.default.get(authOptions.url, { headers: authOptions.headers });
            }
            const playlistDetails = {
                name: data.name,
                description: data.description,
                playlistId: data.id,
                imageURL: data.images[0],
                accessToken: newTokens !== null ? newTokens.access_token : undefined,
                refreshToken: newTokens !== null ? newTokens.refresh_token : undefined,
            };
            return playlistDetails;
        }
        catch (error) {
            throw new Error(error);
        }
    });
};
exports.default = new SpotifyService();
//# sourceMappingURL=spotifyService.js.map