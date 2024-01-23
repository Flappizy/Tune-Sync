"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryHandler = exports.validateHandler = void 0;
const zod_1 = require("zod");
const http_status_1 = require("http-status");
const validateHandler = (schema) => (req, res, next) => {
    try {
        const data = schema.parse(req.body);
        req.body = data;
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errors = error.issues.map((issue) => {
                const field = issue.path.join(".");
                return `${field}: ${issue.message}`;
            });
            res.status(http_status_1.BAD_REQUEST).json({ errors });
        }
    }
};
exports.validateHandler = validateHandler;
const validateQueryHandler = (schema) => (req, res, next) => {
    try {
        const data = schema.parse(req.query);
        req.query = data;
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errors = error.issues.map((issue) => {
                const field = issue.path.join(".");
                return `${field}: ${issue.message}`;
            });
            res.status(http_status_1.BAD_REQUEST).json({ errors });
        }
    }
};
exports.validateQueryHandler = validateQueryHandler;
//# sourceMappingURL=validationMiddleware.js.map