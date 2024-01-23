"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRefreshToken = exports.doesConnectedStreamingPlatformExists = exports.findConnectedStreamingPlatformByUserId = exports.createUserStreamingPlatform = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
    ],
});
prisma.$on('query', (e) => {
    console.log('SQL Query:', e.query);
});
const createUserStreamingPlatform = (input) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.userConnectedStreamingPlatform.create({
        data: {
            streamingPlatform: input.streamingPlatform,
            streamingPlatformRefreshToken: input.streamingPlatformRefreshToken,
            streamingPlatformUserId: input.streamingPlatformUserId,
            user: input.user
        }
    }));
});
exports.createUserStreamingPlatform = createUserStreamingPlatform;
const findConnectedStreamingPlatformByUserId = (userId, platform) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (yield prisma.userConnectedStreamingPlatform.findFirst({
        where: { userId: userId, streamingPlatform: platform },
    }));
});
exports.findConnectedStreamingPlatformByUserId = findConnectedStreamingPlatformByUserId;
const doesConnectedStreamingPlatformExists = (userId, platform) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const count = yield prisma.userConnectedStreamingPlatform.count({
        where: { userId: userId, streamingPlatform: platform },
    });
    if (count > 0) {
        return true;
    }
    else {
        return false;
    }
});
exports.doesConnectedStreamingPlatformExists = doesConnectedStreamingPlatformExists;
const updateRefreshToken = (token, streamingPlatformId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield prisma.userConnectedStreamingPlatform.update({
        where: { id: streamingPlatformId },
        data: {
            streamingPlatformRefreshToken: token,
        },
    });
});
exports.updateRefreshToken = updateRefreshToken;
//# sourceMappingURL=streamingPlatforms.repository.js.map