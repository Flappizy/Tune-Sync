"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const auth_controller_1 = require("src/controllers/auth.controller");
const validationMiddleware_1 = require("src/Infrastructure/Middlewares/validationMiddleware");
const user_validation_1 = require("src/Domain/Validations/user.validation");
const router = express_1.default.Router();
router.post('/register', (0, validationMiddleware_1.validate)(user_validation_1.signupSchema), auth_controller_1.registerUserHandler);
//# sourceMappingURL=auth.routes.js.map