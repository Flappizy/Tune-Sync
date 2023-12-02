import { ErrorCode } from "./errorCode";

export class TuneSyncError{
    message: string;
    status: number;
    errorCodeName: string;

    constructor(errorCode: ErrorCode){
        this.message = errorCode.message;
        this.status = errorCode.status;
        this.errorCodeName = errorCode.errorCodeName;
    }
}