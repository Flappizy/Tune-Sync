"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeezerUserPlaylistsQueryHandler = void 0;
const tslib_1 = require("tslib");
const streamingPlatforms_repository_1 = require("src/Infrastructure/Persistence/Repository/streamingPlatforms.repository");
const client_1 = require("@prisma/client");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const deezerService_1 = tslib_1.__importDefault(require("../../Services/deezerService"));
const http_status_1 = require("http-status");
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const getDeezerUserPlaylistsQueryHandler = (userId, page, perPage) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const streamingPlatform = yield (0, streamingPlatforms_repository_1.findConnectedStreamingPlatformByUserId)(userId, client_1.StreamingPlatform.Deezer);
    if (!streamingPlatform)
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("UnConnectedDeezerAccount", "You have not connected your deezer account, please connect before you can get your playlists", http_status_1.BAD_REQUEST));
    try {
        const userLibrary = yield deezerService_1.default.getUserPlaylist(streamingPlatform.streamingPlatformRefreshToken, page, perPage);
        return userLibrary;
    }
    catch (error) {
        logger_1.default.info(error);
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.ServerError);
    }
});
exports.getDeezerUserPlaylistsQueryHandler = getDeezerUserPlaylistsQueryHandler;
//# sourceMappingURL=getDeezerUserPlaylistsQueryHandler.js.map