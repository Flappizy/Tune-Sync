import { LoginUserInput } from "src/Domain/Validations/auth.validation";
import { TuneSyncError } from 'src/Domain/Exceptions/tuneSyncError';
import { findUniqueUser, updateRefreshToken } from "src/Infrastructure/Persistence/Repository/user.repository";
import { ErrorCode } from "src/Domain/Exceptions/errorCode";
import bcrypt from 'bcryptjs';
import { UNAUTHORIZED } from "http-status";
import { createToken } from "src/Infrastructure/Utilities/jwtHandler";
import { LoginDto } from "./loginDto";
import config from 'config';
import { AuthProvider } from "@prisma/client";

export const loginUserCommandHandler = async (request: LoginUserInput) : Promise<LoginDto> => {
    const user = await findUniqueUser(
        { email: request.email.toLowerCase() },
        { id: true,  email: true, userName: true, passwordHash: true }
     );

    if (!user)
        throw new TuneSyncError(ErrorCode.UserNotExits);

    if (user.authProvider === AuthProvider.Google)
        throw new TuneSyncError(new ErrorCode("InvalidAuthProvider", "Please use google sign in", UNAUTHORIZED))

    if (!(await bcrypt.compare(request.password, user.passwordHash!)))
        throw new TuneSyncError(new ErrorCode("Unauthorized", "Incorrect email or password", UNAUTHORIZED))

    const accessToken = createToken({userName: user.userName, email: user.email, id: user.id }, 'secretKey');
    const refreshToken = createToken({}, 'refreshKey');
    const refreshTokenExpirationInSeconds = parseInt(config.get<string>('refreshExpiration')) / 1000;
    
    const currentDateTime: Date = new Date();
    currentDateTime.setMinutes(currentDateTime.getMinutes() + refreshTokenExpirationInSeconds);

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