"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlistTracksSchema = void 0;
const zod_1 = require("zod");
exports.playlistTracksSchema = zod_1.z.object({
    playlistId: zod_1.z.string(),
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    imageURL: zod_1.z.string().optional(),
    accessToken: zod_1.z.string().optional(),
    refreshToken: zod_1.z.string().optional(),
});
//# sourceMappingURL=streamingPlatform.validation.js.map