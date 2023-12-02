import { Request, Response, NextFunction } from 'express';
import logger from 'src/Shared/Infrastructure/logger';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import { TuneSyncError } from 'src/Domain/Exceptions/tuneSyncError';

export function errorHandler(err: Error | TuneSyncError, req: Request, res: Response, next: NextFunction) {
    let errorCodeName: string = "INTERNAL_SERVER_ERROR";
    let status: number = INTERNAL_SERVER_ERROR;
    let message: string = err.message;
    
    if (err instanceof TuneSyncError) {
        errorCodeName = err.errorCodeName;
        status = err.status;
        message = err.message;
    }

    logger.error(err.message, err);
    return res.status(status).json({
        errorCodeName: errorCodeName,
        status: status,
        message: message
    });
}
