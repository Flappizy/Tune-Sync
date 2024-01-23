"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require('dotenv').config();
const config_1 = tslib_1.__importDefault(require("config"));
const logger_1 = tslib_1.__importDefault(require("./Shared/Infrastructure/logger"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const auth_routes_1 = tslib_1.__importDefault(require("./Routes/auth.routes"));
const spotify_routes_1 = tslib_1.__importDefault(require("./Routes/spotify.routes"));
const deezer_routes_1 = tslib_1.__importDefault(require("./Routes/deezer.routes"));
const errorMiddleware_1 = require("./Infrastructure/Middlewares/errorMiddleware");
const express_1 = tslib_1.__importDefault(require("express"));
const tuneSyncError_1 = require("./Domain/Exceptions/tuneSyncError");
const errorCode_1 = require("./Domain/Exceptions/errorCode");
const swaggerOptions_1 = require("../src/Infrastructure/Utilities/swaggerOptions");
const validateEnv_1 = tslib_1.__importDefault(require("./Infrastructure/Utilities/validateEnv"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
(0, validateEnv_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
const port = config_1.default.get('port');
(0, swaggerOptions_1.swaggerDocs)(app, port);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/spotify', spotify_routes_1.default);
app.use('/api/deezer', deezer_routes_1.default);
app.all('*', (req, res, next) => {
    next(new tuneSyncError_1.TuneSyncError(errorCode_1.ErrorCode.NotFound));
});
if (process.env.NODE_ENV === 'production') {
    app.use((0, helmet_1.default)());
}
app.use(errorMiddleware_1.errorHandler);
app.listen(port, () => {
    logger_1.default.info('Express server started on port: ' + port);
});
//# sourceMappingURL=app.js.map