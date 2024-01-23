"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jwtMiddleware_1 = require("src/Infrastructure/Middlewares/jwtMiddleware");
const express_1 = tslib_1.__importDefault(require("express"));
const paginationMiddleware_1 = require("src/Infrastructure/Middlewares/paginationMiddleware");
const deezer_controller_1 = require("src/Application/Features/StreamingPlatformMgt/Deezer/Controller/deezer.controller");
const router = express_1.default.Router();
router.get('/auth', jwtMiddleware_1.jwtHandler, deezer_controller_1.getAuthorizationCodeFromDeezerHandler).get('/callback', deezer_controller_1.storeDeezerAccessTokenInDBHandler).get('/playlists', [
    paginationMiddleware_1.paginationValidatorMiddleware,
    jwtMiddleware_1.jwtHandler
], deezer_controller_1.getUserPlaylistHandler);
exports.default = router;
//# sourceMappingURL=deezer.routes.js.map