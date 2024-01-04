import { VerifyEmailType } from "src/Domain/Validations/auth.validation"
import { findUniqueUser, verifyUserAccount } from "src/Infrastructure/Persistence/Repository/user.repository"
import { ErrorCode } from "src/Domain/Exceptions/errorCode";
import { TuneSyncError } from "src/Domain/Exceptions/tuneSyncError";
import { BAD_REQUEST, UNAUTHORIZED } from "http-status";
import logger from "src/Shared/Infrastructure/logger";

export const verifyEmailCommandHandler = async (request: VerifyEmailType) => {
    const user = await findUniqueUser({email: request.email});
    if (!user)
        throw new TuneSyncError(ErrorCode.UserNotExits);

    if (!user.emailVerificationToken)
        throw new TuneSyncError(new ErrorCode("AlreadyVerified", "User already verfied", BAD_REQUEST));

    if (user.emailVerificationToken !== request.code)
        throw new TuneSyncError(new ErrorCode("InvalidCode", "Invalid code", UNAUTHORIZED));

    try {
        await verifyUserAccount(user.id, new Date());
    } catch (error) {
        logger.info(error);
        throw new TuneSyncError(ErrorCode.DatabaseError);
    }
}