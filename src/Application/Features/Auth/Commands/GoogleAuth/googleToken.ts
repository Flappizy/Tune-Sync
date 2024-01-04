import config from 'config';
import axios from "axios";
import qs from "qs";
import { OauthTokenDto } from './googleOauthTokenDto';

interface GoogleOauthTokenParameter {
  code: string;
}


export const getGoogleOauthToken = async ({
    code
  }: GoogleOauthTokenParameter): Promise<OauthTokenDto> => {
    const rootURl = "https://oauth2.googleapis.com/token";
  
    const options = {
      code,
      client_id: Buffer.from(
        config.get<string>('googleOauthClientId'),
        'base64'
      ).toString('ascii'),
      client_secret: Buffer.from(
        config.get<string>('googleOauthClientSecret'),
        'base64'
      ).toString('ascii'),
      redirect_uri: config.get<string>('GOOGLE_OAUTH_REDIRECT'),
      grant_type: "authorization_code",
    };
    try {
      const { data } = await axios.post<OauthTokenDto>(
        rootURl,
        qs.stringify(options),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
  
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  };