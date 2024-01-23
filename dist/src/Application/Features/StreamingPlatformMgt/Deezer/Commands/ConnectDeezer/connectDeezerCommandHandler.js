"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDeezerCommandHandler = void 0;
const tslib_1 = require("tslib");
const http_status_1 = require("http-status");
const user_repository_1 = require("src/Infrastructure/Persistence/Repository/user.repository");
const client_1 = require("@prisma/client");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const streamingPlatforms_repository_1 = require("src/Infrastructure/Persistence/Repository/streamingPlatforms.repository");
const deezerService_1 = tslib_1.__importDefault(require("../../Services/deezerService"));
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const connectDeezerCommandHandler = (connectPlatform) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_repository_1.findUniqueUser)({ refreshToken: connectPlatform.userRefreshToken });
    if (!user)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.UserNotExits);
    const deezerAccessToken = yield deezerService_1.default.getDeezerUserAccessToken(connectPlatform.code);
    if (!deezerAccessToken.access_token)
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("InvalidAuthCode", "Server ecountered an error", http_status_1.BAD_REQUEST));
    const deezerUserId = yield deezerService_1.default.getDeezerUserId(deezerAccessToken.access_token);
    logger_1.default.info(deezerUserId);
    try {
        yield (0, streamingPlatforms_repository_1.createUserStreamingPlatform)({
            streamingPlatform: client_1.StreamingPlatform.Deezer,
            streamingPlatformRefreshToken: deezerAccessToken.access_token,
            streamingPlatformUserId: deezerUserId.id.toString(),
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
    return deezerAccessToken;
});
exports.connectDeezerCommandHandler = connectDeezerCommandHandler;
//# sourceMappingURL=connectDeezerCommandHandler.js.map