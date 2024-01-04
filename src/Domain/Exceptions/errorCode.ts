import { BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND } from "http-status";

export class ErrorCode{
    errorCodeName: string;
    message: string;
    status: number;

    static get DatabaseError(): ErrorCode {
        return new ErrorCode('DatabaseError', 'Ecountered an error while saving to DB', INTERNAL_SERVER_ERROR);
    }

    static get ServerError(): ErrorCode {
        return new ErrorCode('ServerError', 'Server ecountered an error', INTERNAL_SERVER_ERROR);
    }

    static get UserAlreadyExits(): ErrorCode {
        return new ErrorCode('UserExists', 'User with this email address already exists', CONFLICT);
    }

    static get UserNotExits(): ErrorCode {
        return new ErrorCode('UserNotExists', 'User does not exists', NOT_FOUND);
    }

    static get NotFound(): ErrorCode {
        return new ErrorCode('NotFound', 'Resource not found', NOT_FOUND);
    }

    static get UnAuthorized(): ErrorCode {
        return new ErrorCode('UnAuthorized', 'User not authorized please log in', UNAUTHORIZED);
    }
    

    constructor(errorCodeName: string, message: string, statusCode: number){
        this.errorCodeName = errorCodeName;
        this.message = message;
        this.status = statusCode;
    }
}
