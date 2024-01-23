"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginGoogleAuthUserCommandHandler = void 0;
const tslib_1 = require("tslib");
const user_repository_1 = require("src/Infrastructure/Persistence/Repository/user.repository");
const googleToken_1 = require("./googleToken");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const http_status_1 = require("http-status");
const googleUser_1 = require("./googleUser");
const client_1 = require("@prisma/client");
const jwtHandler_1 = require("src/Infrastructure/Utilities/jwtHandler");
const config_1 = tslib_1.__importDefault(require("config"));
const loginGoogleAuthUserCommandHandler = (request) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const googleTokens = yield (0, googleToken_1.getGoogleOauthToken)({ code: request });
    if (!googleTokens)
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("InvalidAuthCode", "Invalid authorization code provided", http_status_1.UNAUTHORIZED));
    const googleUserInfo = yield (0, googleUser_1.getGoogleUser)(googleTokens);
    if (!googleUserInfo.verified_email)
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("UnverifiedGoogleAccount", "Google account  not verified", http_status_1.UNAUTHORIZED));
    const user = yield (0, user_repository_1.createOrUpdateExternalAuthUser)({
        userName: googleUserInfo.name,
        email: googleUserInfo.email,
        authProvider: client_1.AuthProvider.Google
    });
    if (!user)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.DatabaseError);
    const accessToken = (0, jwtHandler_1.createToken)({ userName: user.userName, email: user.email, id: user.id }, 'secretKey');
    const refreshToken = (0, jwtHandler_1.createToken)({}, 'refreshKey');
    const refreshTokenExpirationInMilliseconds = parseInt(config_1.default.get('refreshExpiration')) / 1000;
    const currentDateTime = new Date();
    currentDateTime.setMinutes(currentDateTime.getMinutes() + refreshTokenExpirationInMilliseconds);
    yield (0, user_repository_1.updateRefreshToken)(user.id, refreshToken, currentDateTime);
    const loginDto = {
        userName: user.userName,
        email: user.email,
        id: user.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        isVerified: !user.emailVerificationToken
    };
    return loginDto;
});
exports.loginGoogleAuthUserCommandHandler = loginGoogleAuthUserCommandHandler;
//# sourceMappingURL=googleLogin.js.map