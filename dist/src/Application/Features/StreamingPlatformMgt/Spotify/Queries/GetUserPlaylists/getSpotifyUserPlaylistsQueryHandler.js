"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpotifyUserPlaylistsQueryHandler = void 0;
const tslib_1 = require("tslib");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const spotifyService_1 = tslib_1.__importDefault(require("../../Services/spotifyService"));
const streamingPlatforms_repository_1 = require("src/Infrastructure/Persistence/Repository/streamingPlatforms.repository");
const http_status_1 = require("http-status");
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const client_1 = require("@prisma/client");
const getSpotifyUserPlaylistsQueryHandler = (userId, page, perPage, accessToken) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const streamingPlatform = yield (0, streamingPlatforms_repository_1.findConnectedStreamingPlatformByUserId)(userId, client_1.StreamingPlatform.Spotify);
    if (!streamingPlatform)
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("UnConnectedSpotifyAccount", "You have not connected your spotify account, please connect before you can get your playlists", http_status_1.BAD_REQUEST));
    try {
        const userLibrary = yield spotifyService_1.default.getUserPlaylist(accessToken, streamingPlatform.streamingPlatformRefreshToken, streamingPlatform.streamingPlatformUserId, page, perPage);
        if (userLibrary.refreshToken)
            yield (0, streamingPlatforms_repository_1.updateRefreshToken)(userLibrary.refreshToken, streamingPlatform.id);
        return userLibrary;
    }
    catch (error) {
        logger_1.default.info(error);
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.ServerError);
    }
});
exports.getSpotifyUserPlaylistsQueryHandler = getSpotifyUserPlaylistsQueryHandler;
//# sourceMappingURL=getSpotifyUserPlaylistsQueryHandler.js.map