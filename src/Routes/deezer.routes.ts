import { jwtHandler } from 'src/Infrastructure/Middlewares/jwtMiddleware';
import express from 'express';
import { paginationValidatorMiddleware } from 'src/Infrastructure/Middlewares/paginationMiddleware';
import { getAuthorizationCodeFromDeezerHandler, getUserPlaylistHandler, storeDeezerAccessTokenInDBHandler } from 'src/Application/Features/StreamingPlatformMgt/Deezer/Controller/deezer.controller';

const router = express.Router();
router.get(
    '/auth',
    jwtHandler,
    getAuthorizationCodeFromDeezerHandler
).get(
    '/callback',
    storeDeezerAccessTokenInDBHandler
).get(
    '/playlists',
    [
        paginationValidatorMiddleware,
        jwtHandler
    ],
    getUserPlaylistHandler
);

export default router;