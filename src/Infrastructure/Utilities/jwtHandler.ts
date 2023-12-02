import '../../LoadEnv';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';
import logger from 'src/Shared/Infrastructure/logger';

export const createToken = (
    payLoad: Object,
    keyName: 'secretKey' | 'refreshKey'
    ) => {
    const secretKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii');
    const expiration = keyName === 'secretKey' ? 
        config.get<string>('expiration') : config.get<string>('refreshExpiration');;
    
    logger.info(expiration);
    console.log(expiration);

    return jwt.sign(payLoad, secretKey, {
        expiresIn: expiration,
        algorithm: 'HS256',
      });
}

export const validateToken = <T>(
    token: string,
    keyName: 'secretKey' | 'refreshKey'
  ): T | null => {
    try {
      const secretKey = Buffer.from(
        config.get<string>(keyName),
        'base64'
      ).toString('ascii');
      
      const decoded = jwt.verify(token, secretKey) as T;
      return decoded;
    } catch (error) {
      logger.info(error);
      return null;
    }
  };