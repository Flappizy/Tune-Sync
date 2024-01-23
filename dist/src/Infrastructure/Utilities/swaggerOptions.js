"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = void 0;
const tslib_1 = require("tslib");
const swagger_ui_express_1 = tslib_1.__importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = tslib_1.__importDefault(require("swagger-jsdoc"));
const package_json_1 = require("../../../package.json");
const logger_1 = tslib_1.__importDefault(require("../../Shared/Infrastructure/logger"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tune Sync API Docs',
            version: package_json_1.version,
            description: 'API documentation for Tune-Sync backend',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['src/Routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    logger_1.default.info(`Docs available at http://localhost:${port}/api-docs`);
}
exports.swaggerDocs = swaggerDocs;
//# sourceMappingURL=swaggerOptions.js.map