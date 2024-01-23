"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthTokenSchema = exports.refreshTokenSchema = exports.emailSchema = exports.resetPasswordSchema = exports.verifyEmailSchema = exports.loginUserSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
function isStrongPassword(password) {
    if (password === "" || password === null || password.length < 8) {
        return false;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password) || password.includes(' ')) {
        return false;
    }
    return true;
}
var AuthProvider;
(function (AuthProvider) {
    AuthProvider[AuthProvider["Email"] = 0] = "Email";
    AuthProvider[AuthProvider["Google"] = 1] = "Google";
})(AuthProvider || (AuthProvider = {}));
exports.signupSchema = zod_1.z.object({
    userName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
        .refine(value => isStrongPassword(value), { message: 'Password must contain at least one uppercase letter, ' +
            'one lowercase letter, one digit and one special character and must be greater than 8 characters' }),
    confirmPassword: zod_1.z.string()
        .refine(value => isStrongPassword(value), { message: 'Password must contain at least one uppercase letter, ' +
            'one lowercase letter, one digit and one special character and must be greater than 8 characters' }),
    authProvider: zod_1.z.nativeEnum(AuthProvider),
})
    .refine(data => data.password === data.confirmPassword, {
    message: "The passwords did not match",
    path: ['confirmPassword']
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.verifyEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    code: zod_1.z.string(),
});
exports.resetPasswordSchema = zod_1.z.object({
    code: zod_1.z.string(),
    password: zod_1.z.string()
        .refine(value => isStrongPassword(value), { message: 'Password must contain at least one uppercase letter, ' +
            'one lowercase letter, one digit and one special character and must be greater than 8 characters' }),
    confirmPassword: zod_1.z.string()
        .refine(value => isStrongPassword(value), { message: 'Password must contain at least one uppercase letter, ' +
            'one lowercase letter, one digit and one special character and must be greater than 8 characters' })
}).refine(data => data.password === data.confirmPassword, {
    message: "The passwords did not match",
    path: ['confirmPassword']
});
exports.emailSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string()
});
exports.googleAuthTokenSchema = zod_1.z.object({
    authToken: zod_1.z.string()
});
//# sourceMappingURL=auth.validation.js.map