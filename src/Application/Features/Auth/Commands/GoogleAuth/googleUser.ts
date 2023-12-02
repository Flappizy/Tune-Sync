import { GoogleOauthTokenDto } from "./googleOauthTokenDto";
import { GoogleUserDto } from "./googleUserDto";
import axios from "axios";

export async function getGoogleUser({
    id_token,
    access_token,
  }: GoogleOauthTokenDto): Promise<GoogleUserDto> {
    try {
      const { data } = await axios.get<GoogleUserDto>(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      );
  
      return data;
    } catch (err: any) {
      console.log(err);
      throw Error(err);
    }
  }