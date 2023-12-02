"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const http_status_1 = require("http-status");
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
function errorHandler(err, req, res, next) {
    let errorCodeName = "INTERNAL_SERVER_ERROR";
    let status = http_status_1.INTERNAL_SERVER_ERROR;
    let message = err.message;
    if (err instanceof tuneSyncError_1.TuneSyncError) {
        errorCodeName = err.errorCodeName;
        status = err.status;
        message = err.message;
    }
    logger_1.default.error(err.message, err);
    return res.status(status).json({
        errorCodeName: errorCodeName,
        status: status,
        message: message
    });
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorMiddleware.js.map