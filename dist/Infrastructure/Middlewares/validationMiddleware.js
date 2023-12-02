"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const http_status_1 = require("http-status");
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            params: req.params,
            query: req.query,
            body: req.body,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(http_status_1.BAD_REQUEST).json({
                status: 'fail',
                errors: error.errors,
            });
        }
        next(error);
    }
};
exports.validate = validate;
//# sourceMappingURL=validationMiddleware.js.map