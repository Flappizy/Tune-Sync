"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHandler = void 0;
const tslib_1 = require("tslib");
const jwtHandler_1 = require("../Utilities/jwtHandler");
const errorCode_1 = require("src/Domain/Exceptions/errorCode");
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const tuneSyncError_1 = require("src/Domain/Exceptions/tuneSyncError");
const http_status_1 = require("http-status");
function jwtHandler(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ errorCodeName: errorCode_1.ErrorCode.UnAuthorized,
            status: errorCode_1.ErrorCode.UnAuthorized.status,
            message: errorCode_1.ErrorCode.UnAuthorized.message });
    }
    try {
        const decodedToken = (0, jwtHandler_1.validateToken)(token, 'secretKey');
        if (decodedToken === null)
            throw new tuneSyncError_1.TuneSyncError(new errorCode_1.ErrorCode("InvalidToken", "Token is invalid", http_status_1.UNAUTHORIZED));
        if (typeof decodedToken === "object" && "id" in decodedToken) {
            req.body.id = decodedToken.id;
        }
        next();
    }
    catch (error) {
        logger_1.default.info(error);
        next(error);
    }
}
exports.jwtHandler = jwtHandler;
//# sourceMappingURL=jwtMiddleware.js.map