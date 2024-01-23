import { TuneSyncError } from "src/Domain/Exceptions/tuneSyncError";
import { ErrorCode } from "src/Domain/Exceptions/errorCode";
import { findConnectedStreamingPlatformByUserId } from "src/Infrastructure/Persistence/Repository/streamingPlatforms.repository";
import { PlaylistTracksSchemaType } from "src/Domain/Validations/streamingPlatform.validation";
import { StreamingPlatform } from "@prisma/client";
import { BAD_REQUEST } from "http-status";
import spotifyService from "../../Services/spotifyService";
import { PlaylistTracksDto } from "./playlistTracksDto";
import logger from "src/Shared/Infrastructure/logger";

export const getSpotifyPlaylistTracksQueryHandler = async (playlistDetails: PlaylistTracksSchemaType, userId: number, page: string, perPage: string): Promise<PlaylistTracksDto> => {
    const streamingPlatform = await findConnectedStreamingPlatformByUserId(userId, StreamingPlatform.Spotify);
    if (!streamingPlatform)
        throw new TuneSyncError(new ErrorCode("UnConnectedSpotifyAccount", 
            "You have not connected your spotify account, please connect before you can get your playlist's tracks", BAD_REQUEST));
      
    try {
        const playlistTracks = await spotifyService.getPlayListTracks(playlistDetails, streamingPlatform.streamingPlatformRefreshToken!, page, perPage);
        return playlistTracks;
    } catch (error: any) {
        throw error;
    }
}