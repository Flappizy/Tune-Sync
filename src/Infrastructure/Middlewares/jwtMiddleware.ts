import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../Utilities/jwtHandler';
import { ErrorCode } from 'src/Domain/Exceptions/errorCode';
import logger from 'src/Shared/Infrastructure/logger';
import { TuneSyncError } from 'src/Domain/Exceptions/tuneSyncError';
import { UNAUTHORIZED } from 'http-status';


export function jwtHandler(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token){
        return res.status(401).json({ errorCodeName: ErrorCode.UnAuthorized,
            status: ErrorCode.UnAuthorized.status,
            message: ErrorCode.UnAuthorized.message });
    } 
    try {
        const decodedToken = validateToken(token, 'secretKey');
        if (decodedToken === null)
            throw new TuneSyncError(new ErrorCode("InvalidToken", "Token is invalid", UNAUTHORIZED));

        if (typeof decodedToken === "object" && "id" in decodedToken!) {
          req.body.id = decodedToken.id;
        }
        next();
      } catch (error) {
        logger.info(error);
        next(error);
      }
}