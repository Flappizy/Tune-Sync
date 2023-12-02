"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuneSyncError = void 0;
class TuneSyncError {
    constructor(errorCode) {
        this.message = errorCode.message;
        this.status = errorCode.status;
        this.errorCodeName = errorCode.errorCodeName;
    }
}
exports.TuneSyncError = TuneSyncError;
//# sourceMappingURL=tuneSyncError.js.map