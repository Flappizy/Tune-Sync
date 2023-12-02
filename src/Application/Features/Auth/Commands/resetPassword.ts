import { ResetPasswordType } from "src/Domain/Validations/auth.validation";
import { findUniqueUser, resetUserPassword } from "src/Infrastructure/Persistence/Repository/user.repository";
import { TuneSyncError } from "src/Domain/Exceptions/tuneSyncError";
import { ErrorCode } from "src/Domain/Exceptions/errorCode";
import bcrypt from 'bcryptjs';
import logger from "src/Shared/Infrastructure/logger";

export const resetPassword = async (req: ResetPasswordType) => {
    const user = await findUniqueUser(
        { passwordResetToken: req.code });

    if (!user)
        throw new TuneSyncError(ErrorCode.UserNotExits);

    const hashedPassword = await bcrypt.hash(req.password, 12);
    
    try {
        await resetUserPassword(req.code, hashedPassword);
    } catch (error) {
        logger.info(error);
        throw new TuneSyncError(ErrorCode.DatabaseError);
    }
}