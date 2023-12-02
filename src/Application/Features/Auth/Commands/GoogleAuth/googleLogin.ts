import { createOrUpdateExternalAuthUser, updateRefreshToken } from "src/Infrastructure/Persistence/Repository/user.repository";
import { getGoogleOauthToken } from "./googleToken";
import { ErrorCode } from "src/Domain/Exceptions/errorCode";
import { TuneSyncError } from "src/Domain/Exceptions/tuneSyncError";
import { UNAUTHORIZED } from "http-status";
import { getGoogleUser } from "./googleUser";
import { AuthProvider } from "@prisma/client";
import { createToken } from "src/Infrastructure/Utilities/jwtHandler";
import { LoginDto } from "../Login/loginDto";
import config from 'config';

export const loginGoogleAuthUser = async(request: string) => {
    const googleTokens = await getGoogleOauthToken({code: request});
    if (!googleTokens)
        throw new TuneSyncError(new ErrorCode("InvalidAuthCode", "Invalid authorization code provided", UNAUTHORIZED));

    const googleUserInfo = await getGoogleUser(googleTokens);
    if (!googleUserInfo.verified_email)
        throw new TuneSyncError(new ErrorCode("UnverifiedGoogleAccount", "Google account  not verified", UNAUTHORIZED));

    const user = await createOrUpdateExternalAuthUser({
        userName: googleUserInfo.name,
        email: googleUserInfo.email,
        authProvider: AuthProvider.Google
    });
    
    if (!user)
        throw new TuneSyncError(ErrorCode.DatabaseError);

        const accessToken = createToken({userName: user.userName, email: user.email, id: user.id }, 'secretKey');
        const refreshToken = createToken({}, 'refreshKey');
        const refreshTokenExpirationInMilliseconds = parseInt(config.get<string>('refreshExpiration')) / 1000; 
        
        const currentDateTime: Date = new Date();
        currentDateTime.setMinutes(currentDateTime.getMinutes() + refreshTokenExpirationInMilliseconds);
    
        await updateRefreshToken(user.id, refreshToken, currentDateTime);
    
        const loginDto: LoginDto = {
            userName: user.userName,
            email: user.email,
            id: user.id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            isVerified: !user.emailVerificationToken
        };
        
        return loginDto;
}