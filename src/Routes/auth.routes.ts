import express from 'express';
import { registerUserHandler, loginUserHandler, verifyUserAccountHandler, generateOtpHandler, forgotPasswordHandler, resetUserPasswordHandler, refreshTokenHandler, logoutHandler, loginGoogleUserHandler } from 'src/Application/Features/Auth/Controllers/auth.controller';
import { validateHandler, validateQueryHandler } from 'src/Infrastructure/Middlewares/validationMiddleware';
import { signupSchema, loginUserSchema, verifyEmailSchema, emailSchema, resetPasswordSchema, refreshTokenSchema, googleAuthTokenSchema } from 'src/Domain/Validations/auth.validation';
import { jwtHandler } from 'src/Infrastructure/Middlewares/jwtMiddleware';

const router = express.Router();

router.post('/register', validateHandler(signupSchema), registerUserHandler)
.post('/login', validateHandler(loginUserSchema), loginUserHandler)
.put('/verify', validateHandler(verifyEmailSchema), verifyUserAccountHandler)
.post('/generate-otp', validateHandler(emailSchema), generateOtpHandler)
.put('/forgot-password', validateHandler(emailSchema), forgotPasswordHandler)
.put('/reset-password', validateHandler(resetPasswordSchema), resetUserPasswordHandler)
.post('/refreshToken', refreshTokenHandler)
.post('/logout', logoutHandler)
.post('/login-google', validateQueryHandler(googleAuthTokenSchema), loginGoogleUserHandler);

export default router;