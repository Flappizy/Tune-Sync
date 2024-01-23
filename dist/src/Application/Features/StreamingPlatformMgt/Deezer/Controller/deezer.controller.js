"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPlaylistHandler = exports.storeDeezerAccessTokenInDBHandler = exports.getAuthorizationCodeFromDeezerHandler = void 0;
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("config"));
const customCookieOptions_1 = require("src/Infrastructure/Utilities/customCookieOptions");
const connectDeezerCommandHandler_1 = require("../Commands/ConnectDeezer/connectDeezerCommandHandler");
const getDeezerUserPlaylistsQueryHandler_1 = require("../Queries/GetUserPlaylists/getDeezerUserPlaylistsQueryHandler");
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const getAuthorizationCodeFromDeezerHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const permissions = config_1.default.get('deezerScope');
    const appId = config_1.default.get('deezerAppId');
    const redirectURI = config_1.default.get('deezerRedirectURI');
    const url = `https://connect.deezer.com/oauth/auth.php?app_id=${appId}&redirect_uri=${redirectURI}&perms=${permissions}`;
    const state = req.cookies.refresh_token;
    res.cookie('deezer_state', state, customCookieOptions_1.stateCookiesOptions);
    logger_1.default.info(state);
    return res.status(200).json(url);
});
exports.getAuthorizationCodeFromDeezerHandler = getAuthorizationCodeFromDeezerHandler;
const storeDeezerAccessTokenInDBHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const state = req.cookies.deezer_state;
    if (!state)
        return res.status(401).json({ message: "Please log in before you can connect your deezer account" });
    if (req.query.error_reason || req.query.error_reason === 'user_denied')
        return res.status(401).json({
            status: "failed",
            message: 'Deezer access denied by user'
        });
    const code = req.query.code;
    logger_1.default.info(code);
    try {
        yield (0, connectDeezerCommandHandler_1.connectDeezerCommandHandler)({ code: code, userRefreshToken: state });
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.storeDeezerAccessTokenInDBHandler = storeDeezerAccessTokenInDBHandler;
const getUserPlaylistHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.body.id);
    const page = Number(req.query.page);
    const perPage = Number(req.query.perPage);
    try {
        const userLibrary = yield (0, getDeezerUserPlaylistsQueryHandler_1.getDeezerUserPlaylistsQueryHandler)(userId, page, perPage);
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
//# sourceMappingURL=deezer.controller.js.map