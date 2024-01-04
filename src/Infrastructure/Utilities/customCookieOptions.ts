import { CookieOptions } from 'express';
import config from 'config';


export const refreshTokenCookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    expires: new Date(
        Date.now() + config.get<number>('refreshExpiration') * 60 * 1000
    ),
    //maxAge: Date.now() + config.get<number>('refreshExpiration') * 60 * 1000
};

export const stateCookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    expires: new Date(
        Date.now() + 60 * 60 * 1000
    )
};

export const spotifyCookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    expires: new Date(
        Date.now() + 60 * 60 * 1000
    )
};



  