"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtpCommandHandler = void 0;
const tslib_1 = require("tslib");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const user_repository_1 = require("src/Infrastructure/Persistence/Repository/user.repository");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = require("fs");
const emailService_1 = require("src/Infrastructure/Utilities/emailService");
const handlebars_1 = tslib_1.__importDefault(require("handlebars"));
const generateOtpCommandHandler = (request) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_repository_1.findUniqueUser)({ email: request.email.toLowerCase() });
    if (!user)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.UserNotExits);
    const htmlEmailString = yield fs_1.promises.readFile(path_1.default.join(__dirname, "../../../../EmailTemplates/VerificationCode.handlebars"), "utf-8");
    if (user.emailVerificationToken) {
        const emailTemplate = handlebars_1.default.compile(htmlEmailString);
        const messageBody = (emailTemplate({
            name: user.userName,
            code: user.emailVerificationToken,
            purpose: "account verification"
        }));
        yield (0, emailService_1.sendMail)(messageBody, 'Account Verification', user.email);
    }
    else {
        const emailTemplate = handlebars_1.default.compile(htmlEmailString);
        const messageBody = (emailTemplate({
            name: user.userName,
            code: user.passwordResetToken,
            purpose: "password reset"
        }));
        yield (0, emailService_1.sendMail)(messageBody, "Reset Password", request.email);
    }
});
exports.generateOtpCommandHandler = generateOtpCommandHandler;
//# sourceMappingURL=generateOtp.js.map