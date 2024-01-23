"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
function validateEnv() {
    (0, envalid_1.cleanEnv)(process.env, {
        DATABASE_URL: (0, envalid_1.str)(),
        PORT: (0, envalid_1.port)(),
        NODE_ENV: (0, envalid_1.str)(),
        JwtConfig_SecretKey: (0, envalid_1.str)(),
        JwtConfig_RefreshKey: (0, envalid_1.str)(),
        JwtConfig_EncryptingKey: (0, envalid_1.str)(),
        SENDGRID_API_KEY: (0, envalid_1.str)()
    });
}
exports.default = validateEnv;
//# sourceMappingURL=validateEnv.js.map