"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressLogger = void 0;
const { format, transports, createLogger } = require("winston");
const { combine, timestamp, prettyPrint } = format;
const timezone = () => {
    return new Date().toLocaleString("en-US", {
        timeZone: "Africa/Lagos",
    });
};
const logger = createLogger({
    level: "info",
    format: combine(timestamp({
        format: timezone(),
    }), prettyPrint()),
    transports: [
        new transports.Console(),
    ],
});
logger.meta = false;
exports.expressLogger = logger;
exports.default = logger;
//# sourceMappingURL=logger.js.map