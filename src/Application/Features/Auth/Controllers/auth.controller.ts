import { signupCommandHandler } from 'src/Application/Features/Auth/Commands/signup';
import { loginUserCommandHandler } from 'src/Application/Features/Auth/Commands/Login/login';
import { verifyEmailCommandHandler } from 'src/Application/Features/Auth/Commands/verifyEmail';
import { forgotPasswordCommandHandler } from '../Commands/forgotPassword';
import { resetPasswordCommandHandler } from 'src/Application/Features/Auth/Commands/resetPassword';
import { refreshUserTokenCommandHandler } from 'src/Application/Features/Auth/Commands/RefreshToken/refreshToken';
import { NextFunction, Request, Response } from 'express';
import { refreshTokenCookiesOptions } from 'src/Infrastructure/Utilities/customCookieOptions';
import { SignupSchemaType, LoginUserInput, VerifyEmailType, EmailType, ResetPasswordType, RefreshTokenType } from "src/Domain/Validations/auth.validation";
import { generateOtpCommandHandler } from 'src/Application/Features/Auth/Commands/generateOtp';
import { loginGoogleAuthUserCommandHandler } from 'src/Application/Features/Auth/Commands/GoogleAuth/googleLogin';

export const registerUserHandler =  async (
  req: Request<{}, {}, SignupSchemaType>,
  res: Response,
  next: NextFunction) => {

    try {      
      await signupCommandHandler(req.body);      
      return res.status(201).json({
        status: 'success',
        data: {
          message: "Signup Successful",
        },
      });
    } catch (error : any) {       
      next(error); 
    }
}

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction) => {

    try {      
      const loginDto = await loginUserCommandHandler(req.body);  
      res.cookie('refresh_token', loginDto.refreshToken, refreshTokenCookiesOptions);
      return res.status(200).json({
        status: 'success',
        loginDto
      });
    } catch (error : any) {       
      next(error); 
    } 
}

export const verifyUserAccountHandler = async (
  req: Request<{}, {}, VerifyEmailType>,
  res: Response,
  next: NextFunction
) => {
    try {
        await verifyEmailCommandHandler(req.body);
        return res.status(200).json({
          status: 'success',
          data: {
            message: "Successful verification",
          }
        });
    } catch (error: any) {
       next(error);
    }
}

export const generateOtpHandler = async (
  req: Request<{}, {}, EmailType>,
  res: Response,
  next: NextFunction
) => {
    try {
      await generateOtpCommandHandler(req.body);
      return res.status(204).send();
    } catch (error) {
        next(error);
    }
} 

export const forgotPasswordHandler = async (
  req: Request<{}, {}, EmailType>,
  res: Response,
  next: NextFunction
) => {
    try {
      await forgotPasswordCommandHandler(req.body);
      return res.status(204).send();
    } catch (error) {
        next(error);
    }
} 

export const resetUserPasswordHandler = async (
  req: Request<{}, {}, ResetPasswordType>,
  res: Response,
  next: NextFunction
) => {
    try {
        await resetPasswordCommandHandler(req.body);
        return res.status(200).json({
          status: 'success',
          data: {
            message: "Password reset was successful",
          }
        });
    } catch (error: any) {
       next(error);
    }
}

export const refreshTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken)
          return res.status(401).json({
            status: 'failed',
            data: {
              message: "User is unauthorized please login"
            }
        });

        const refreshTokenType: RefreshTokenType = {
            refreshToken: refreshToken
        }
        const response = await refreshUserTokenCommandHandler(refreshTokenType);

        res.cookie('refresh_token', response.refreshToken, refreshTokenCookiesOptions);
        return res.status(200).json({
          status: 'success',
          data: {
            accessToken: response.accessToken
          }
        });
    } catch (error: any) {
       next(error);
    }
}

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        res.cookie('refresh_token', '', { maxAge: 1 });
        return res.status(200).json({
          status: 'success',
          data: {
            message: "user logged out successfully",
          }
        });
    } catch (error: any) {
       next(error);
    }
}

export const loginGoogleUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction) => {

    try {      
      const code: any = req.query.code;
      const loginDto = await loginGoogleAuthUserCommandHandler(code);  
      res.cookie('refresh_token', loginDto.refreshToken, refreshTokenCookiesOptions);
      return res.status(200).json({
        status: 'success',
        loginDto
      });
    } catch (error : any) {       
      next(error); 
    } 
}

