"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserHandler = void 0;
const tslib_1 = require("tslib");
const signup_1 = require("src/Application/Auth/Commands/Signup/signup");
const registerUserHandler = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, signup_1.signup)(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                message: "Signup Successful",
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerUserHandler = registerUserHandler;
//# sourceMappingURL=auth.controller.js.map