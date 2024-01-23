"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupCommandHandler = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@prisma/client");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const user_repository_1 = require("src/Infrastructure/Persistence/Repository/user.repository");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const otplib_1 = require("otplib");
const handlebars_1 = tslib_1.__importDefault(require("handlebars"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = require("fs");
const emailService_1 = require("src/Infrastructure/Utilities/emailService");
const signupCommandHandler = (request) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var emailInDb = yield (0, user_repository_1.findUniqueUser)({ email: request.email.toLowerCase() }, { email: true });
    if (emailInDb)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.UserAlreadyExits);
    const hashedPassword = yield bcryptjs_1.default.hash(request.password, 12);
    const secretKey = otplib_1.authenticator.generateSecret();
    const verificationCode = otplib_1.authenticator.generate(secretKey);
    const user = yield (0, user_repository_1.createUser)({
        userName: request.userName,
        email: request.email.toLowerCase(),
        passwordHash: hashedPassword,
        emailVerificationToken: verificationCode,
        authProvider: client_1.AuthProvider.Email
    });
    if (!user)
        throw new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.DatabaseError);
    const htmlEmailString = yield fs_1.promises.readFile(path_1.default.join(__dirname, "../../../../EmailTemplates/VerificationCode.handlebars"), "utf-8");
    const emailTemplate = handlebars_1.default.compile(htmlEmailString);
    const messageBody = (emailTemplate({
        name: request.userName,
        code: verificationCode,
        purpose: "account verification"
    }));
    yield (0, emailService_1.sendMail)(messageBody, "Account Verification", request.email);
});
exports.signupCommandHandler = signupCommandHandler;
//# sourceMappingURL=signup.js.map