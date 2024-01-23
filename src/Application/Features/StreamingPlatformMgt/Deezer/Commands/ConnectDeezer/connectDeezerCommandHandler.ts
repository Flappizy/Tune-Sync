import { BAD_REQUEST } from "http-status";
import { findUniqueUser } from "src/Infrastructure/Persistence/Repository/user.repository";
import { StreamingPlatform } from "@prisma/client";
import { StreamingPlatformConnect } from "src/Domain/Validations/streamingPlatform.validation";
import { DeezerOAuthDto } from "./deezerOauthDto";
import { TuneSyncError } from "src/Domain/Exceptions/tuneSyncError";
import { ErrorCode } from "src/Domain/Exceptions/errorCode";
import { createUserStreamingPlatform, doesConnectedStreamingPlatformExists } from "src/Infrastructure/Persistence/Repository/streamingPlatforms.repository";
import deezerService from "../../Services/deezerService";
import logger from "src/Shared/Infrastructure/logger";

export const connectDeezerCommandHandler = async (connectPlatform: StreamingPlatformConnect):
Promise<DeezerOAuthDto> => {
    const user = await findUniqueUser({ refreshToken: connectPlatform.userRefreshToken });
    if (!user)
        throw new TuneSyncError(ErrorCode.UserNotExits);

    /*    
    const userHasConnectedDeezer = await doesConnectedStreamingPlatformExists(user.id, StreamingPlatform.Deezer);
    if(userHasConnectedDeezer)
        throw new TuneSyncError(new ErrorCode("DeezerHasAlredyBeenConnected", "User's Deezer account has already been connected", BAD_REQUEST));
    */
    const deezerAccessToken = await deezerService.getDeezerUserAccessToken(connectPlatform.code);
    if (!deezerAccessToken.access_token)
        throw new TuneSyncError(new ErrorCode("InvalidAuthCode", "Server ecountered an error", BAD_REQUEST));

    const deezerUserId = await deezerService.getDeezerUserId(deezerAccessToken.access_token);
    logger.info(deezerUserId);
    try {
        await createUserStreamingPlatform({
            streamingPlatform: StreamingPlatform.Deezer,
            streamingPlatformRefreshToken: deezerAccessToken.access_token,
            streamingPlatformUserId: deezerUserId.id.toString(),
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
    
    return deezerAccessToken;
}