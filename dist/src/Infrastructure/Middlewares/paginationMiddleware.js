"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationValidatorMiddleware = void 0;
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
function paginationValidatorMiddleware(req, res, next) {
    {
        logger_1.default.info(req.query);
        if (!req.query || Object.keys(req.query).length === 0) {
            req.query = { page: '1', perPage: '50' };
        }
        next();
    }
    ;
}
exports.paginationValidatorMiddleware = paginationValidatorMiddleware;
//# sourceMappingURL=paginationMiddleware.js.map