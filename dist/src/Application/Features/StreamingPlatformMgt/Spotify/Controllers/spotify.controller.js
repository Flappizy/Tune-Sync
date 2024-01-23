"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaylistTracksHandler = exports.getUserPlaylistHandler = exports.storeSpotifyRefreshInDBAndAccessTokenInCookiesHandler = exports.getAuthorizationCodeFromSpotifyHandler = void 0;
const tslib_1 = require("tslib");
const customCookieOptions_1 = require("src/Infrastructure/Utilities/customCookieOptions");
const config_1 = tslib_1.__importDefault(require("config"));
const connectSpotifyCommandHandler_1 = require("../Commands/ConnectSpotify/connectSpotifyCommandHandler");
const getSpotifyUserPlaylistsQueryHandler_1 = require("../Queries/GetUserPlaylists/getSpotifyUserPlaylistsQueryHandler");
const getPlaylistTracksQueryHandler_1 = require("../Queries/GetPlaylistTracks/getPlaylistTracksQueryHandler");
const getAuthorizationCodeFromSpotifyHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const scope = config_1.default.get('spotifyScope');
    const clientId = config_1.default.get('spotifyClientId');
    const redirectURI = config_1.default.get('spotifyRedirectURI');
    const state = req.cookies.refresh_token;
    const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code&scope=${scope}&state=${state}`;
    res.cookie('spotify_state', state, customCookieOptions_1.stateCookiesOptions);
    return res.status(200).json(url);
});
exports.getAuthorizationCodeFromSpotifyHandler = getAuthorizationCodeFromSpotifyHandler;
const storeSpotifyRefreshInDBAndAccessTokenInCookiesHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const state = req.cookies.spotify_state;
    if (state !== req.query.state || !state || !req.query.state)
        return res.status(401).send();
    if (req.query.error)
        return res.status(401).json({
            status: "failed",
            message: 'Spotify access denied by user'
        });
    const code = req.query.code;
    try {
        const response = yield (0, connectSpotifyCommandHandler_1.connectSpotifyCommandHandler)({ code: code, userRefreshToken: state });
        res.cookie('spotify_access_token', response.access_token, customCookieOptions_1.spotifyCookiesOptions);
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.storeSpotifyRefreshInDBAndAccessTokenInCookiesHandler = storeSpotifyRefreshInDBAndAccessTokenInCookiesHandler;
const getUserPlaylistHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.body.id);
    const accessToken = req.cookies.spotify_access_token;
    const page = Number(req.query.page);
    const perPage = Number(req.query.perPage);
    try {
        const userLibrary = yield (0, getSpotifyUserPlaylistsQueryHandler_1.getSpotifyUserPlaylistsQueryHandler)(userId, page, perPage, accessToken);
        if (userLibrary.accessToken)
            res.cookie('spotify_access_token', userLibrary.accessToken, customCookieOptions_1.spotifyCookiesOptions);
        return res.status(200).json({
            playLists: userLibrary.playLists,
            total: userLibrary.total,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserPlaylistHandler = getUserPlaylistHandler;
const getPlaylistTracksHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.body.id);
    const accessToken = req.cookies.spotify_access_token;
    const page = Number(req.query.page);
    const playlistId = req.query.playlistId;
    const perPage = Number(req.query.perPage);
    const playlistDetails = {
        accessToken: accessToken,
        playlistId: playlistId
    };
    try {
        const playlistTracks = yield (0, getPlaylistTracksQueryHandler_1.getSpotifyPlaylistTracksQueryHandler)(playlistDetails, userId, page, perPage);
        res.cookie('spotify_access_token', playlistTracks.accessToken, customCookieOptions_1.spotifyCookiesOptions);
        return res.status(200).json({
            status: 'success',
            data: playlistTracks
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getPlaylistTracksHandler = getPlaylistTracksHandler;
//# sourceMappingURL=spotify.controller.js.map