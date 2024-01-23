"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const tslib_1 = require("tslib");
const mail_1 = tslib_1.__importDefault(require("@sendgrid/mail"));
const config_1 = tslib_1.__importDefault(require("config"));
const logger_1 = tslib_1.__importDefault(require("src/Shared/Infrastructure/logger"));
const sendMail = (messageBody, subject, userEmail) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    mail_1.default.setApiKey(config_1.default.get('sendgridApiKey'));
    const msg = {
        to: userEmail,
        from: 'flappizydev@gmail.com',
        subject: subject,
        html: messageBody,
    };
    mail_1.default.send(msg)
        .then((response) => {
        logger_1.default.info(response[0].statusCode);
    })
        .catch((error) => {
        logger_1.default.info(error);
    });
});
exports.sendMail = sendMail;
//# sourceMappingURL=emailService.js.map