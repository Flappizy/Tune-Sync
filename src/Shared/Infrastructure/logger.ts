import expressWinston from "express-winston";

const { format, transports, createLogger } = require("winston");
const { combine, timestamp, prettyPrint } = format;


const timezone = () => {
    return new Date().toLocaleString("en-US", {
      timeZone: "Africa/Lagos",
    });
  };
  
  const logger = createLogger({
    level: "info",
    format: combine(
      timestamp({
        format: timezone(),
      }),
      prettyPrint()
    ),
    transports: [
      // TODO: add conditional logging to db.
      // new transports.File({filename: `./logs/${thisMonthAndYear}/error.log`, level: 'error'}),
      // new transports.File({filename: `./logs/${thisMonthAndYear}/combined.log`}),
      new transports.Console(),
    ],
  });
  
  logger.meta = false;
  export const expressLogger: expressWinston.LoggerOptions = logger;
  
  export default logger;