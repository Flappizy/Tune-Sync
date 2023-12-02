"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const path_1 = tslib_1.__importDefault(require("path"));
const envFilePath = path_1.default.resolve(`.env`);
const result = dotenv_1.default.config({ path: envFilePath });
if (result.error) {
    console.error(result.error);
}
//# sourceMappingURL=LoadEnv.js.map