import express from 'express';
import { getAuthorizationCodeFromSpotifyHandler, storeSpotifyRefreshInDBAndAccessTokenInCookiesHandler, getUserPlaylistHandler } from '../Application/Features/StreamingPlatformMgt/Spotify/Controllers/spotify.controller';
import { paginationValidatorMiddleware } from 'src/Infrastructure/Middlewares/paginationMiddleware';
import { jwtHandler } from 'src/Infrastructure/Middlewares/jwtMiddleware';

const router = express.Router();
router.get(
    '/auth',
    jwtHandler,
    getAuthorizationCodeFromSpotifyHandler
).post(
    '/callback',
    storeSpotifyRefreshInDBAndAccessTokenInCookiesHandler
).get(
    '/playlists',
    [
        paginationValidatorMiddleware,
        jwtHandler
    ],
    getUserPlaylistHandler
);

export default router;