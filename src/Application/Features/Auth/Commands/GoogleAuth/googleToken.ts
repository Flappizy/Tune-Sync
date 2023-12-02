import config from 'config';
import axios from "axios";
import qs from "qs";
import { GoogleOauthTokenDto } from './googleOauthTokenDto';

interface GoogleOauthTokenParameter {
  code: string;
}


export const getGoogleOauthToken = async ({
    code
  }: GoogleOauthTokenParameter): Promise<GoogleOauthTokenDto> => {
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
      redirect_uri: Buffer.from(
        config.get<string>('GOOGLE_OAUTH_REDIRECT'),
        'base64'
      ).toString('ascii'),
      grant_type: "authorization_code",
    };
    try {
      const { data } = await axios.post<GoogleOauthTokenDto>(
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
      console.log("Failed to fetch Google Oauth Tokens");
      throw new Error(err);
    }
  };