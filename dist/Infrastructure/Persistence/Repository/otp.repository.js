"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOTPByUserId = exports.createOTP = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOTP = (code, userId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.oTP.create({
        data: {
            code: code,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
    }));
});
exports.createOTP = createOTP;
const findOTPByUserId = (userId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.oTP.findFirst({
        where: {
            user: {
                id: userId,
            }
        },
    });
});
exports.findOTPByUserId = findOTPByUserId;
//# sourceMappingURL=otp.repository.js.map