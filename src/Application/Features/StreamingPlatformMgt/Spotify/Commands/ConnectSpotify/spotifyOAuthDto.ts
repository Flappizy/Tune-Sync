import { OauthTokenDto } from "src/Application/Features/Auth/Commands/GoogleAuth/googleOauthTokenDto";

export type SpotifyOAuthDto = Omit<OauthTokenDto, 'id_token'>;