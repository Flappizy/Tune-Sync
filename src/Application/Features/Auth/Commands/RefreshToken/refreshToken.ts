import { RefreshTokenType } from "src/Domain/Validations/auth.validation";
import { validateToken } from "src/Infrastructure/Utilities/jwtHandler";
import { TuneSyncError } from "src/Domain/Exceptions/tuneSyncError";
import { ErrorCode } from "src/Domain/Exceptions/errorCode";
import { findUniqueUser, updateRefreshToken } from "src/Infrastructure/Persistence/Repository/user.repository";
import { UNAUTHORIZED } from "http-status";
import config from 'config';
import { createToken } from "src/Infrastructure/Utilities/jwtHandler";
import { RefreshTokenDto } from "./refreshTokenDto";

export const refreshUserToken = async (req:RefreshTokenType) : Promise<RefreshTokenDto> => {
    const validationResultOfRefreshToken = validateToken(req.refreshToken, 'refreshKey');
    if (!validationResultOfRefreshToken)
        throw new TuneSyncError(ErrorCode.UnAuthorized);

    const user =  await findUniqueUser({ refreshToken: req.refreshToken });
    if (!user)
        throw new TuneSyncError(ErrorCode.UserNotExits);

    const currentDateTime: Date = new Date();

    if (user.refreshTokenExpires! < currentDateTime)
        throw new TuneSyncError(new ErrorCode("InvalidRefreshToken", "Refresh token has expired, please login", UNAUTHORIZED))

    
    const accessToken = createToken({userName: user.userName, email: user.email, id: user.id }, 'secretKey');
    const refreshToken = createToken({}, 'refreshKey');
    const refreshTokenExpirationInSeconds = parseInt(config.get<string>('refreshExpiration')) / 1000;
        
    currentDateTime.setMinutes(currentDateTime.getMinutes() + refreshTokenExpirationInSeconds);
    
    await updateRefreshToken(user.id, refreshToken, currentDateTime);

    const response : RefreshTokenDto = {
        accessToken: accessToken,
        refreshToken: refreshToken
    } 
    
    return response;
}