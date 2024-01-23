import express from 'express';
import { getAuthorizationCodeFromSpotifyHandler, 
    storeSpotifyRefreshInDBAndAccessTokenInCookiesHandler, 
    getUserPlaylistHandler,
    getPlaylistTracksHandler
} from '../Application/Features/StreamingPlatformMgt/Spotify/Controllers/spotify.controller';
import { paginationValidatorMiddleware } from 'src/Infrastructure/Middlewares/paginationMiddleware';
import { validateQueryHandler } from 'src/Infrastructure/Middlewares/validationMiddleware';
import { jwtHandler } from 'src/Infrastructure/Middlewares/jwtMiddleware';
import { playlistTracksSchema } from 'src/Domain/Validations/streamingPlatform.validation';

const router = express.Router();
router.get(
    '/auth',
    jwtHandler,
    getAuthorizationCodeFromSpotifyHandler
).get(
    '/callback',
    storeSpotifyRefreshInDBAndAccessTokenInCookiesHandler
).get(
    '/playlists',
    [
        paginationValidatorMiddleware,
        jwtHandler
    ],
    getUserPlaylistHandler
).get(
    '/playlist-tracks',
    [
        validateQueryHandler(playlistTracksSchema),
        paginationValidatorMiddleware,
        jwtHandler
    ],
    getPlaylistTracksHandler
);

export default router;