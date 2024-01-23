"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginGoogleUserHandler = exports.logoutHandler = exports.refreshTokenHandler = exports.resetUserPasswordHandler = exports.forgotPasswordHandler = exports.generateOtpHandler = exports.verifyUserAccountHandler = exports.loginUserHandler = exports.registerUserHandler = void 0;
const tslib_1 = require("tslib");
const signup_1 = require("src/Application/Features/Auth/Commands/signup");
const login_1 = require("src/Application/Features/Auth/Commands/Login/login");
const verifyEmail_1 = require("src/Application/Features/Auth/Commands/verifyEmail");
const forgotPassword_1 = require("../Commands/forgotPassword");
const resetPassword_1 = require("src/Application/Features/Auth/Commands/resetPassword");
const refreshToken_1 = require("src/Application/Features/Auth/Commands/RefreshToken/refreshToken");
const customCookieOptions_1 = require("src/Infrastructure/Utilities/customCookieOptions");
const generateOtp_1 = require("src/Application/Features/Auth/Commands/generateOtp");
const googleLogin_1 = require("src/Application/Features/Auth/Commands/GoogleAuth/googleLogin");
const registerUserHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, signup_1.signupCommandHandler)(req.body);
        return res.status(201).json({
            status: 'success',
            data: {
                message: "Signup Successful",
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerUserHandler = registerUserHandler;
const loginUserHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginDto = yield (0, login_1.loginUserCommandHandler)(req.body);
        res.cookie('refresh_token', loginDto.refreshToken, customCookieOptions_1.refreshTokenCookiesOptions);
        return res.status(200).json({
            status: 'success',
            loginDto
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUserHandler = loginUserHandler;
const verifyUserAccountHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, verifyEmail_1.verifyEmailCommandHandler)(req.body);
        return res.status(200).json({
            status: 'success',
            data: {
                message: "Successful verification",
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyUserAccountHandler = verifyUserAccountHandler;
const generateOtpHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, generateOtp_1.generateOtpCommandHandler)(req.body);
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.generateOtpHandler = generateOtpHandler;
const forgotPasswordHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, forgotPassword_1.forgotPasswordCommandHandler)(req.body);
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.forgotPasswordHandler = forgotPasswordHandler;
const resetUserPasswordHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, resetPassword_1.resetPasswordCommandHandler)(req.body);
        return res.status(200).json({
            status: 'success',
            data: {
                message: "Password reset was successful",
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetUserPasswordHandler = resetUserPasswordHandler;
const refreshTokenHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken)
            return res.status(401).json({
                status: 'failed',
                data: {
                    message: "User is unauthorized please login"
                }
            });
        const refreshTokenType = {
            refreshToken: refreshToken
        };
        const response = yield (0, refreshToken_1.refreshUserTokenCommandHandler)(refreshTokenType);
        res.cookie('refresh_token', response.refreshToken, customCookieOptions_1.refreshTokenCookiesOptions);
        return res.status(200).json({
            status: 'success',
            data: {
                accessToken: response.accessToken
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshTokenHandler = refreshTokenHandler;
const logoutHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('refresh_token', '', { maxAge: 1 });
        return res.status(200).json({
            status: 'success',
            data: {
                message: "user logged out successfully",
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.logoutHandler = logoutHandler;
const loginGoogleUserHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code;
        const loginDto = yield (0, googleLogin_1.loginGoogleAuthUserCommandHandler)(code);
        res.cookie('refresh_token', loginDto.refreshToken, customCookieOptions_1.refreshTokenCookiesOptions);
        return res.status(200).json({
            status: 'success',
            loginDto
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginGoogleUserHandler = loginGoogleUserHandler;
//# sourceMappingURL=auth.controller.js.map