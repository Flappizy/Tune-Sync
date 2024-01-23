"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordCommandHandler = void 0;
const tslib_1 = require("tslib");
const user_repository_1 = require("src/Infrastructure/Persistence/Repository/user.repository");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const resetPasswordCommandHandler = (req) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_repository_1.findUniqueUser)({ passwordResetToken: req.code });
    if (!user)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.UserNotExits);
    const hashedPassword = yield bcryptjs_1.default.hash(req.password, 12);
    try {
        yield (0, user_repository_1.resetUserPassword)(req.code, hashedPassword);
    }
    catch (error) {
        logger_1.default.info(error);
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.DatabaseError);
    }
});
exports.resetPasswordCommandHandler = resetPasswordCommandHandler;
//# sourceMappingURL=resetPassword.js.map