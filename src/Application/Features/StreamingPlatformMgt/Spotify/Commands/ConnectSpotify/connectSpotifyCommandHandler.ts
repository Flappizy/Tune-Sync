import { ErrorCode } from "src/Domain/Exceptions/errorCode";
import { TuneSyncError } from "src/Domain/Exceptions/tuneSyncError";
import { StreamingPlatformConnect } from "src/Domain/Validations/streamingPlatform.validation";
import { createUserStreamingPlatform, doesConnectedStreamingPlatformExists } from "src/Infrastructure/Persistence/Repository/streamingPlatforms.repository";
import { findUniqueUser } from "src/Infrastructure/Persistence/Repository/user.repository";
import { StreamingPlatform } from "@prisma/client";
import spotifyService from "../../Services/spotifyService";
import logger from "src/Shared/Infrastructure/logger";
import { SpotifyOAuthDto } from "./spotifyOAuthDto";
import { BAD_REQUEST } from "http-status";

export const connectSpotifyCommandHandler = async (connectPlatform: StreamingPlatformConnect): 
Promise<SpotifyOAuthDto> => {

    const user = await findUniqueUser({ refreshToken: connectPlatform.userRefreshToken });
    if (!user)
        throw new TuneSyncError(ErrorCode.UserNotExits);

    const userHasConnectedSpotify = await doesConnectedStreamingPlatformExists(user.id, StreamingPlatform.Spotify);
    if(userHasConnectedSpotify)
        throw new TuneSyncError(new ErrorCode("SpotifyHasAlredyBeenConnected", "User's Spotify account has already been connected", BAD_REQUEST));

    const spotifyRefreshAndAccessToken = await spotifyService.getSpotifyUserAccessAndRefreshToken(connectPlatform.code);
    const spotifyUserId = await spotifyService.getUserProfileData(spotifyRefreshAndAccessToken.access_token);

    try {
        await createUserStreamingPlatform({
            streamingPlatform: StreamingPlatform.Spotify,
            streamingPlatformRefreshToken: spotifyRefreshAndAccessToken.refresh_token,
            streamingPlatformUserId: spotifyUserId.id,
            user: {
                connect: {
                    id: user.id
                }
            }
        });
    } catch (error) {
        logger.info(error);
        throw new TuneSyncError(ErrorCode.DatabaseError);
    } 
    
    return spotifyRefreshAndAccessToken;
}