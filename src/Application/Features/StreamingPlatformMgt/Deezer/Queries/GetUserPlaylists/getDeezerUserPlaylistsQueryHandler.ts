import { findConnectedStreamingPlatformByUserId } from "src/Infrastructure/Persistence/Repository/streamingPlatforms.repository";
import { StreamingPlatform } from "@prisma/client";
import { TuneSyncError } from "src/Domain/Exceptions/tuneSyncError";
import { ErrorCode } from "src/Domain/Exceptions/errorCode";
import { LibraryDto } from "../../../Spotify/Queries/GetUserPlaylists/libraryDto";
import deezerService from "../../Services/deezerService";
import { BAD_REQUEST } from "http-status";
import logger from "src/Shared/Infrastructure/logger";

export const getDeezerUserPlaylistsQueryHandler = async (userId: number, page: number, perPage: number): 
Promise<LibraryDto> => {
    const streamingPlatform = await findConnectedStreamingPlatformByUserId(userId, StreamingPlatform.Deezer);
    if (!streamingPlatform)
        throw new TuneSyncError(new ErrorCode("UnConnectedDeezerAccount", 
            "You have not connected your deezer account, please connect before you can get your playlists", BAD_REQUEST));

    try {
        const userLibrary = await deezerService.getUserPlaylist(streamingPlatform.streamingPlatformRefreshToken!, 
            page, perPage);
        
        return userLibrary;
    } catch (error) {
        logger.info(error);
        throw new TuneSyncError(ErrorCode.ServerError);
    }
}