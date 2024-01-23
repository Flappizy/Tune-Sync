"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshUserTokenCommandHandler = void 0;
const tslib_1 = require("tslib");
const jwtHandler_1 = require("src/Infrastructure/Utilities/jwtHandler");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const user_repository_1 = require("src/Infrastructure/Persistence/Repository/user.repository");
const http_status_1 = require("http-status");
const config_1 = tslib_1.__importDefault(require("config"));
const jwtHandler_2 = require("src/Infrastructure/Utilities/jwtHandler");
const refreshUserTokenCommandHandler = (req) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const validationResultOfRefreshToken = (0, jwtHandler_1.validateToken)(req.refreshToken, 'refreshKey');
    if (!validationResultOfRefreshToken)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.UnAuthorized);
    const user = yield (0, user_repository_1.findUniqueUser)({ refreshToken: req.refreshToken });
    if (!user)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.UserNotExits);
    const currentDateTime = new Date();
    if (user.refreshTokenExpires < currentDateTime)
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("InvalidRefreshToken", "Refresh token has expired, please login", http_status_1.UNAUTHORIZED));
    const accessToken = (0, jwtHandler_2.createToken)({ userName: user.userName, email: user.email, id: user.id }, 'secretKey');
    const refreshToken = (0, jwtHandler_2.createToken)({}, 'refreshKey');
    const refreshTokenExpirationInSeconds = parseInt(config_1.default.get('refreshExpiration')) / 1000;
    currentDateTime.setMinutes(currentDateTime.getMinutes() + refreshTokenExpirationInSeconds);
    yield (0, user_repository_1.updateRefreshToken)(user.id, refreshToken, currentDateTime);
    const response = {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
    return response;
});
exports.refreshUserTokenCommandHandler = refreshUserTokenCommandHandler;
//# sourceMappingURL=refreshToken.js.map