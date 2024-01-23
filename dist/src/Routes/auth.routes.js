"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const auth_controller_1 = require("src/Application/Features/Auth/Controllers/auth.controller");
const validationMiddleware_1 = require("src/Infrastructure/Middlewares/validationMiddleware");
const auth_validation_1 = require("src/Domain/Validations/auth.validation");
const router = express_1.default.Router();
router.post('/register', (0, validationMiddleware_1.validateHandler)(auth_validation_1.signupSchema), auth_controller_1.registerUserHandler)
    .post('/login', (0, validationMiddleware_1.validateHandler)(auth_validation_1.loginUserSchema), auth_controller_1.loginUserHandler)
    .put('/verify', (0, validationMiddleware_1.validateHandler)(auth_validation_1.verifyEmailSchema), auth_controller_1.verifyUserAccountHandler)
    .post('/generate-otp', (0, validationMiddleware_1.validateHandler)(auth_validation_1.emailSchema), auth_controller_1.generateOtpHandler)
    .put('/forgot-password', (0, validationMiddleware_1.validateHandler)(auth_validation_1.emailSchema), auth_controller_1.forgotPasswordHandler)
    .put('/reset-password', (0, validationMiddleware_1.validateHandler)(auth_validation_1.resetPasswordSchema), auth_controller_1.resetUserPasswordHandler)
    .post('/refreshToken', auth_controller_1.refreshTokenHandler)
    .post('/logout', auth_controller_1.logoutHandler)
    .post('/login-google', (0, validationMiddleware_1.validateQueryHandler)(auth_validation_1.googleAuthTokenSchema), auth_controller_1.loginGoogleUserHandler);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map