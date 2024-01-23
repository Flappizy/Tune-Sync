"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailCommandHandler = void 0;
const tslib_1 = require("tslib");
const user_repository_1 = require("src/Infrastructure/Persistence/Repository/user.repository");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const http_status_1 = require("http-status");
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const verifyEmailCommandHandler = (request) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_repository_1.findUniqueUser)({ email: request.email });
    if (!user)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.UserNotExits);
    if (!user.emailVerificationToken)
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("AlreadyVerified", "User already verfied", http_status_1.BAD_REQUEST));
    if (user.emailVerificationToken !== request.code)
        throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("InvalidCode", "Invalid code", http_status_1.UNAUTHORIZED));
    try {
        yield (0, user_repository_1.verifyUserAccount)(user.id, new Date());
    }
    catch (error) {
        logger_1.default.info(error);
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.DatabaseError);
    }
});
exports.verifyEmailCommandHandler = verifyEmailCommandHandler;
//# sourceMappingURL=verifyEmail.js.map