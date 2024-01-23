"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSpotifyCommandHandler = void 0;
const tslib_1 = require("tslib");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const streamingPlatforms_repository_1 = require("src/Infrastructure/Persistence/Repository/streamingPlatforms.repository");
const user_repository_1 = require("src/Infrastructure/Persistence/Repository/user.repository");
const client_1 = require("@prisma/client");
const spotifyService_1 = tslib_1.__importDefault(require("../../Services/spotifyService"));
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const http_status_1 = require("http-status");
const connectSpotifyCommandHandler = (connectPlatform) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_repository_1.findUniqueUser)({ refreshToken: connectPlatform.userRefreshToken });
    if (!user)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.UserNotExits);
    const userHasConnectedSpotify = yield (0, streamingPlatforms_repository_1.doesConnectedStreamingPlatformExists)(user.id, client_1.StreamingPlatform.Spotify);
    if (userHasConnectedSpotify)
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("SpotifyHasAlredyBeenConnected", "User's Spotify account has already been connected", http_status_1.BAD_REQUEST));
    const spotifyRefreshAndAccessToken = yield spotifyService_1.default.getSpotifyUserAccessAndRefreshToken(connectPlatform.code);
    const spotifyUserId = yield spotifyService_1.default.getUserProfileData(spotifyRefreshAndAccessToken.access_token);
    try {
        yield (0, streamingPlatforms_repository_1.createUserStreamingPlatform)({
            streamingPlatform: client_1.StreamingPlatform.Spotify,
            streamingPlatformRefreshToken: spotifyRefreshAndAccessToken.refresh_token,
            streamingPlatformUserId: spotifyUserId.id,
            user: {
                connect: {
                    id: user.id
                }
            }
        });
    }
    catch (error) {
        logger_1.default.info(error);
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.DatabaseError);
    }
    return spotifyRefreshAndAccessToken;
});
exports.connectSpotifyCommandHandler = connectSpotifyCommandHandler;
//# sourceMappingURL=connectSpotifyCommandHandler.js.map