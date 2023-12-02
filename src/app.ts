//import './LoadEnv';
require('dotenv').config();
import config from 'config';
import logger from './Shared/Infrastructure/logger';
import morgan from 'morgan';
import helmet from 'helmet';
import authRouter from './Routes/auth.routes';
import cors from 'cors';
import { errorHandler } from './Infrastructure/Middlewares/errorMiddleware';
import express, { NextFunction, Request, Response, response } from 'express';
import { TuneSyncError} from './Domain/Exceptions/tuneSyncError';
import { ErrorCode } from './Domain/Exceptions/errorCode';
import { swaggerDocs } from '../src/Infrastructure/Utilities/swaggerOptions';
import validateEnv from './Infrastructure/Utilities/validateEnv';
import cookieParser from 'cookie-parser';


validateEnv();

const app = express();

 // 1.Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// 2. Cors
/*app.use(
    cors({
      origin: [config.get<string>('origin')],
      credentials: true,
    })
  );*/

//Response Compression
//app.use(compression());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


const port =  config.get<number>('port');

//Swagger
swaggerDocs(app, port);

// ROUTES
app.use('/api/auth', authRouter);

 // UNHANDLED ROUTES
 app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new TuneSyncError(ErrorCode.NotFound));
  });

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

//handles error
app.use(errorHandler);

// Start the serverr
app.listen(port, () => {
   logger.info('Express server started on port: ' + port);
});
