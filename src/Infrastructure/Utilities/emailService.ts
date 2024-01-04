import sgMail from '@sendgrid/mail';
import config from 'config';
import logger from 'src/Shared/Infrastructure/logger';

export const sendMail = async(messageBody: string, subject: string, userEmail: string) => {
    sgMail.setApiKey(config.get<string>('sendgridApiKey'));
    const msg = {
      to: userEmail, // Change to your recipient
      from: 'flappizydev@gmail.com', // Change to your verified sender
      subject: subject,
      html: messageBody,
    }

    sgMail.send(msg)
    .then((response) => {
      logger.info(response[0].statusCode)
    })
    .catch((error) => {
      logger.info(error)
    });
} 