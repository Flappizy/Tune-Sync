import { AuthProvider} from '@prisma/client';
import { SignupSchemaType } from '../../../../Domain/Validations/auth.validation';
import bcrypt from 'bcryptjs';
import { createUser, findUniqueUser } from 'src/Infrastructure/Persistence/Repository/user.repository';
import { TuneSyncError } from 'src/Domain/Exceptions/tuneSyncError';
import { ErrorCode } from 'src/Domain/Exceptions/errorCode';
import { authenticator } from 'otplib';
import Handlebars from 'handlebars';
import path from 'path';
import { promises as fs } from 'fs';
import { sendMail } from 'src/Infrastructure/Utilities/emailService';

export const signup = async (request : SignupSchemaType) => {      

    var emailInDb = await findUniqueUser(
      { email: request.email.toLowerCase() },
      { email: true }
   );

    if (emailInDb) 
      throw new TuneSyncError(ErrorCode.UserAlreadyExits);
  
    const hashedPassword = await bcrypt.hash(request.password, 12);

    const secretKey = authenticator.generateSecret();
    const verificationCode = authenticator.generate(secretKey);

    const user = await createUser({
      userName: request.userName,
      email: request.email.toLowerCase(),
      passwordHash: hashedPassword,
      emailVerificationToken: verificationCode,
      authProvider: AuthProvider.Email
    });

    if (!user)
      throw new TuneSyncError(ErrorCode.DatabaseError);

    const htmlEmailString = await fs.readFile(path.join(__dirname, 
      "../../../../EmailTemplates/VerificationCode.handlebars"),  "utf-8");

    const emailTemplate = Handlebars.compile(htmlEmailString);
    const messageBody = (emailTemplate({
        name: request.userName,
        code: verificationCode,
        purpose: "account verification"
    }));

    await sendMail(messageBody, "Account Verification", request.email);
}