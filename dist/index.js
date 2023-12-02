"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("./LoadEnv");
const server_1 = tslib_1.__importDefault(require("./server"));
const logger_1 = tslib_1.__importDefault(require("./Shared/Infrastructure/logger"));
const port = Number(process.env.PORT);
server_1.default.listen(port, () => {
    logger_1.default.info('Express server started on port: ' + port);
});
//# sourceMappingURL=index.js.map