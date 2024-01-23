"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserPassword = exports.updateRefreshToken = exports.updateUserPasswordToken = exports.updateUserVerificationToken = exports.verifyUserAccount = exports.findUniqueUser = exports.createOrUpdateExternalAuthUser = exports.createUser = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (input) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.create({
        data: {
            userName: input.userName,
            email: input.email,
            authProvider: input.authProvider,
            emailVerificationToken: input.emailVerificationToken,
            passwordHash: input.passwordHash
        }
    }));
});
exports.createUser = createUser;
const createOrUpdateExternalAuthUser = (input) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.upsert({
        where: { email: input.email },
        create: {
            created: new Date(),
            userName: input.userName,
            email: input.email,
            emailConfirmed: new Date(),
            authProvider: input.authProvider,
        },
        update: {
            userName: input.userName,
            email: input.email
        },
    }));
});
exports.createOrUpdateExternalAuthUser = createOrUpdateExternalAuthUser;
const findUniqueUser = (where, select) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.findUnique({
        where,
        select,
    }));
});
exports.findUniqueUser = findUniqueUser;
const verifyUserAccount = (userId, emailConfirmed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: { id: userId },
        data: {
            emailVerificationToken: null,
            emailConfirmed: emailConfirmed
        },
    });
});
exports.verifyUserAccount = verifyUserAccount;
const updateUserVerificationToken = (token) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: { emailVerificationToken: token },
        data: {
            emailVerificationToken: token,
        },
    });
});
exports.updateUserVerificationToken = updateUserVerificationToken;
const updateUserPasswordToken = (id, token) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: { id: id },
        data: {
            passwordResetToken: token,
        },
    });
});
exports.updateUserPasswordToken = updateUserPasswordToken;
const updateRefreshToken = (id, token, date) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: { id: id },
        data: {
            refreshTokenExpires: date,
            refreshToken: token
        },
    });
});
exports.updateRefreshToken = updateRefreshToken;
const resetUserPassword = (token, hashedPassword) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: { passwordResetToken: token },
        data: {
            passwordResetToken: null,
            passwordHash: hashedPassword
        },
    });
});
exports.resetUserPassword = resetUserPassword;
//# sourceMappingURL=user.repository.js.map