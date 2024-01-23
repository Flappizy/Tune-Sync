"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const spotify_controller_1 = require("../Application/Features/StreamingPlatformMgt/Spotify/Controllers/spotify.controller");
const paginationMiddleware_1 = require("src/Infrastructure/Middlewares/paginationMiddleware");
const validationMiddleware_1 = require("src/Infrastructure/Middlewares/validationMiddleware");
const jwtMiddleware_1 = require("src/Infrastructure/Middlewares/jwtMiddleware");
const streamingPlatform_validation_1 = require("src/Domain/Validations/streamingPlatform.validation");
const router = express_1.default.Router();
router.get('/auth', jwtMiddleware_1.jwtHandler, spotify_controller_1.getAuthorizationCodeFromSpotifyHandler).get('/callback', spotify_controller_1.storeSpotifyRefreshInDBAndAccessTokenInCookiesHandler).get('/playlists', [
    paginationMiddleware_1.paginationValidatorMiddleware,
    jwtMiddleware_1.jwtHandler
], spotify_controller_1.getUserPlaylistHandler).get('/playlist-tracks', [
    paginationMiddleware_1.paginationValidatorMiddleware,
    (0, validationMiddleware_1.validateQueryHandler)(streamingPlatform_validation_1.playlistTracksSchema),
    jwtMiddleware_1.jwtHandler
], spotify_controller_1.getPlaylistTracksHandler);
exports.default = router;
//# sourceMappingURL=spotify.routes.js.map