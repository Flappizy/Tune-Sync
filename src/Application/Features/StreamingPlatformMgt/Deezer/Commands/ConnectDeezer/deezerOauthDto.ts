import { OauthTokenDto } from "src/Application/Features/Auth/Commands/GoogleAuth/googleOauthTokenDto";

export type DeezerOAuthDto = Omit<OauthTokenDto, 'id_token' | 'expires_in' | 'refresh_token' | 'token_type' | 'scope'>;