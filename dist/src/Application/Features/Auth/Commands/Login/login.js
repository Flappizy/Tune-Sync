"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserCommandHandler = void 0;
const tslib_1 = require("tslib");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const user_repository_1 = require("src/Infrastructure/Persistence/Repository/user.repository");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const http_status_1 = require("http-status");
const jwtHandler_1 = require("src/Infrastructure/Utilities/jwtHandler");
const config_1 = tslib_1.__importDefault(require("config"));
const client_1 = require("@prisma/client");
const loginUserCommandHandler = (request) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_repository_1.findUniqueUser)({ email: request.email.toLowerCase() }, { id: true, email: true, userName: true, passwordHash: true });
    if (!user)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.UserNotExits);
    if (user.authProvider === client_1.AuthProvider.Google)
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("InvalidAuthProvider", "Please use google sign in", http_status_1.UNAUTHORIZED));
    if (!(yield bcryptjs_1.default.compare(request.password, user.passwordHash)))
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("Unauthorized", "Incorrect email or password", http_status_1.UNAUTHORIZED));
    const accessToken = (0, jwtHandler_1.createToken)({ userName: user.userName, email: user.email, id: user.id }, 'secretKey');
    const refreshToken = (0, jwtHandler_1.createToken)({}, 'refreshKey');
    const refreshTokenExpirationInSeconds = parseInt(config_1.default.get('refreshExpiration')) / 1000;
    const currentDateTime = new Date();
    currentDateTime.setMinutes(currentDateTime.getMinutes() + refreshTokenExpirationInSeconds);
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
exports.loginUserCommandHandler = loginUserCommandHandler;
//# sourceMappingURL=login.js.map