"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUniqueUser = exports.createUser = void 0;
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
const findUniqueUser = (where, select) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.user.findUnique({
        where,
        select,
    }));
});
exports.findUniqueUser = findUniqueUser;
//# sourceMappingURL=user.repository.js.map