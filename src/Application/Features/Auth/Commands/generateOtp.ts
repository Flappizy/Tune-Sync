import { ErrorCode } from 'src/Domain/Exceptions/errorCode';
import { TuneSyncError } from 'src/Domain/Exceptions/tuneSyncError';
import { EmailType } from 'src/Domain/Validations/auth.validation';
import { findUniqueUser } from 'src/Infrastructure/Persistence/Repository/user.repository';
import path from 'path';
import { promises as fs } from 'fs';
import { sendMail } from 'src/Infrastructure/Utilities/emailService';
import Handlebars from 'handlebars';



export const generateOtpCommandHandler = async (request: EmailType) => {
    const user = await findUniqueUser(
        { email: request.email.toLowerCase() });

    if (!user)
        throw new TuneSyncError(ErrorCode.UserNotExits);

    const htmlEmailString = await fs.readFile(path.join(__dirname, 
        "../../../../EmailTemplates/VerificationCode.handlebars"),  "utf-8");
    if (user.emailVerificationToken){
        
          const emailTemplate = Handlebars.compile(htmlEmailString);
          const messageBody = (emailTemplate({
              name: user.userName,
              code: user.emailVerificationToken,
              purpose: "account verification"
          }));

        await sendMail(messageBody, 'Account Verification', user.email);
    }
    else{
            
        const emailTemplate = Handlebars.compile(htmlEmailString);
        const messageBody = (emailTemplate({
            name: user.userName,
            code: user.passwordResetToken,
            purpose: "password reset"
        }));

        await sendMail(messageBody, "Reset Password", request.email);
    }
}
