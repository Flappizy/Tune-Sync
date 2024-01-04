import { ErrorCode } from "src/Domain/Exceptions/errorCode";
import { TuneSyncError } from "src/Domain/Exceptions/tuneSyncError";
import spotifyService from "../../Services/spotifyService";
import { LibraryDto } from "./libraryDto";
import { findConnectedStreamingPlatformByUserId, updateRefreshToken } from "src/Infrastructure/Persistence/Repository/streamingPlatforms.repository";
import { BAD_REQUEST } from "http-status";
import logger from "src/Shared/Infrastructure/logger";
import { StreamingPlatform } from "@prisma/client";

export const getSpotifyUserPlaylistsQueryHandler = async (userId: number, page: number, perPage: number, accessToken: string): 
Promise<LibraryDto> => {
    const streamingPlatform = await findConnectedStreamingPlatformByUserId(userId, StreamingPlatform.Spotify);
    if (!streamingPlatform)
        throw new TuneSyncError(new ErrorCode("UnConnectedSpotifyAccount", 
            "You have not connected your spotify account, please connect before you can get your playlists", BAD_REQUEST));

    try {
        const userLibrary = await spotifyService.getUserPlaylist(accessToken, 
                streamingPlatform.streamingPlatformRefreshToken!, streamingPlatform.streamingPlatformUserId!, page, perPage);
        
        if (userLibrary.refreshToken)
            await updateRefreshToken(userLibrary.refreshToken, streamingPlatform.id);

        return userLibrary;
    } catch (error) {
        logger.info(error);
        throw new TuneSyncError(ErrorCode.ServerError);
    }
}