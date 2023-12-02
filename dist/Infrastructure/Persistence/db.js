"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDB = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
function initializeDB() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const dataSource = new typeorm_1.DataSource({
            type: "postgres",
            host: process.env.TYPEORM_HOST,
            port: parseInt(process.env.TYPEORM_PORT),
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
        });
        yield dataSource.initialize();
        logger_1.default.info('Database successfully initialized');
    });
}
exports.initializeDB = initializeDB;
//# sourceMappingURL=db.js.map