"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpotifyPlaylistTracksQueryHandler = void 0;
const tslib_1 = require("tslib");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const streamingPlatforms_repository_1 = require("src/Infrastructure/Persistence/Repository/streamingPlatforms.repository");
const client_1 = require("@prisma/client");
const http_status_1 = require("http-status");
const spotifyService_1 = tslib_1.__importDefault(require("../../Services/spotifyService"));
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const getSpotifyPlaylistTracksQueryHandler = (playlistDetails, userId, page, perPage) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const streamingPlatform = yield (0, streamingPlatforms_repository_1.findConnectedStreamingPlatformByUserId)(userId, client_1.StreamingPlatform.Spotify);
    if (!streamingPlatform)
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("UnConnectedSpotifyAccount", "You have not connected your spotify account, please connect before you can get your playlist's tracks", http_status_1.BAD_REQUEST));
    try {
        const playlistTracks = yield spotifyService_1.default.getPlayListTracks(playlistDetails, streamingPlatform.streamingPlatformRefreshToken, page, perPage);
        return playlistTracks;
    }
    catch (error) {
        logger_1.default.info(error);
        throw new Error(error);
    }
});
exports.getSpotifyPlaylistTracksQueryHandler = getSpotifyPlaylistTracksQueryHandler;
//# sourceMappingURL=getPlaylistTracksQueryHandler.js.map