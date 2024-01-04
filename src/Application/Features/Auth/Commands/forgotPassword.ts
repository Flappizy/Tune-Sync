import { EmailType } from 'src/Domain/Validations/auth.validation';
import { findUniqueUser, updateUserPasswordToken } from 'src/Infrastructure/Persistence/Repository/user.repository';
import { TuneSyncError } from 'src/Domain/Exceptions/tuneSyncError';
import { ErrorCode } from 'src/Domain/Exceptions/errorCode';
import path from 'path';
import { promises as fs } from 'fs';
import { authenticator } from 'otplib';
import logger from 'src/Shared/Infrastructure/logger';
import { sendMail } from 'src/Infrastructure/Utilities/emailService';
import Handlebars from 'handlebars';

export const forgotPasswordCommandHandler = async(req: EmailType) => {
    const user = await findUniqueUser(
        { email: req.email.toLowerCase() });

    if (!user)
        throw new TuneSyncError(ErrorCode.UserNotExits);

    const htmlEmailString = await fs.readFile(path.join(__dirname, 
        "../../../../EmailTemplates/VerificationCode.handlebars"),  "utf-8");
    
    let passwordResetToken = generateToken();
    let userWithThisPasswordResetToken = await findUniqueUser({
        passwordResetToken: passwordResetToken});
    
    while(userWithThisPasswordResetToken){
        passwordResetToken = generateToken();
        userWithThisPasswordResetToken = await findUniqueUser({
            passwordResetToken: passwordResetToken});
    }

    try {
        await updateUserPasswordToken(user.id, passwordResetToken);
    } catch (error) {
        logger.info(error);
        throw new TuneSyncError(ErrorCode.DatabaseError);
    }

    const emailTemplate = Handlebars.compile(htmlEmailString);
        const messageBody = (emailTemplate({
            name: user.userName,
            code: passwordResetToken,
            purpose: "password reset"
        }));

    await sendMail(messageBody, "Reset Password", req.email);
} 

function generateToken() {
    const secretKey = authenticator.generateSecret();
    const verificationCode = authenticator.generate(secretKey);
    return verificationCode;
}