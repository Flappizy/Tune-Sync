"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const tslib_1 = require("tslib");
require("./LoadEnv");
const client_1 = require("@prisma/client");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const user_repository_1 = require("src/Infrastructure/Persistence/Repository/user.repository");
const otp_repository_1 = require("src/Infrastructure/Persistence/Repository/otp.repository");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const otplib_1 = require("otplib");
const handlebars_1 = tslib_1.__importDefault(require("handlebars"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = require("fs");
const mail_1 = tslib_1.__importDefault(require("@sendgrid/mail"));
const config_1 = tslib_1.__importDefault(require("config"));
const signup = (request) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
    yield (0, otp_repository_1.createOTP)(verificationCode, user.id);
    const htmlEmailString = yield fs_1.promises.readFile(path_1.default.join(__dirname, "../../../../EmailTemplates/VerificationCode.handlebars"), "utf-8");
    const emailTemplate = handlebars_1.default.compile(htmlEmailString);
    const messageBody = (emailTemplate({
        name: request.userName,
        code: verificationCode
    }));
    mail_1.default.setApiKey(config_1.default.get('sendgridApiKey'));
    const msg = {
        to: request.email,
        from: 'flappizydev@gmail.com',
        subject: 'Account Verification Code',
        html: messageBody,
    };
    mail_1.default.send(msg)
        .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
    })
        .catch((error) => {
        console.error(error);
    });
});
exports.signup = signup;
//# sourceMappingURL=signup.js.map