"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
const http_status_1 = require("http-status");
class ErrorCode {
    static get DatabaseError() {
        return new ErrorCode('DatabaseError', 'Ecountered an error while saving to DB', http_status_1.INTERNAL_SERVER_ERROR);
    }
    static get ServerError() {
        return new ErrorCode('ServerError', 'Server ecountered an error', http_status_1.INTERNAL_SERVER_ERROR);
    }
    static get UserAlreadyExits() {
        return new ErrorCode('UserExists', 'User with this email address already exists', http_status_1.CONFLICT);
    }
    static get UserNotExits() {
        return new ErrorCode('UserNotExists', 'User does not exists', http_status_1.NOT_FOUND);
    }
    static get NotFound() {
        return new ErrorCode('NotFound', 'Resource not found', http_status_1.NOT_FOUND);
    }
    static get UnAuthorized() {
        return new ErrorCode('UnAuthorized', 'User not authorized please log in', http_status_1.UNAUTHORIZED);
    }
    constructor(errorCodeName, message, statusCode) {
        this.errorCodeName = errorCodeName;
        this.message = message;
        this.status = statusCode;
    }
}
exports.ErrorCode = ErrorCode;
//# sourceMappingURL=errorCode.js.map