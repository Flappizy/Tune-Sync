"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordCommandHandler = void 0;
const tslib_1 = require("tslib");
const user_repository_1 = require("src/Infrastructure/Persistence/Repository/user.repository");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = require("fs");
const otplib_1 = require("otplib");
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const emailService_1 = require("src/Infrastructure/Utilities/emailService");
const handlebars_1 = tslib_1.__importDefault(require("handlebars"));
const forgotPasswordCommandHandler = (req) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_repository_1.findUniqueUser)({ email: req.email.toLowerCase() });
    if (!user)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.UserNotExits);
    const htmlEmailString = yield fs_1.promises.readFile(path_1.default.join(__dirname, "../../../../EmailTemplates/VerificationCode.handlebars"), "utf-8");
    let passwordResetToken = generateToken();
    let userWithThisPasswordResetToken = yield (0, user_repository_1.findUniqueUser)({
        passwordResetToken: passwordResetToken
    });
    while (userWithThisPasswordResetToken) {
        passwordResetToken = generateToken();
        userWithThisPasswordResetToken = yield (0, user_repository_1.findUniqueUser)({
            passwordResetToken: passwordResetToken
        });
    }
    try {
        yield (0, user_repository_1.updateUserPasswordToken)(user.id, passwordResetToken);
    }
    catch (error) {
        logger_1.default.info(error);
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.DatabaseError);
    }
    const emailTemplate = handlebars_1.default.compile(htmlEmailString);
    const messageBody = (emailTemplate({
        name: user.userName,
        code: passwordResetToken,
        purpose: "password reset"
    }));
    yield (0, emailService_1.sendMail)(messageBody, "Reset Password", req.email);
});
exports.forgotPasswordCommandHandler = forgotPasswordCommandHandler;
function generateToken() {
    const secretKey = otplib_1.authenticator.generateSecret();
    const verificationCode = otplib_1.authenticator.generate(secretKey);
    return verificationCode;
}
//# sourceMappingURL=forgotPassword.js.map