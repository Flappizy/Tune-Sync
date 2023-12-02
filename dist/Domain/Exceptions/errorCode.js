"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
const http_status_1 = require("http-status");
class ErrorCode {
    static get DatabaseError() {
        return new ErrorCode('DatabaseError', 'Ecountered an error while saving to DB', http_status_1.INTERNAL_SERVER_ERROR);
    }
    static get UserAlreadyExits() {
        return new ErrorCode('UserExists', 'User with this email address already exists', http_status_1.CONFLICT);
    }
    constructor(errorCodeName, message, statusCode) {
        this.errorCodeName = errorCodeName;
        this.message = message;
        this.status = statusCode;
    }
}
exports.ErrorCode = ErrorCode;
//# sourceMappingURL=errorCode.js.map