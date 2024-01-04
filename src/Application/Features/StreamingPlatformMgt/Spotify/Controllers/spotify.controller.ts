import { NextFunction, Request, Response } from 'express';
import { stateCookiesOptions, spotifyCookiesOptions } from 'src/Infrastructure/Utilities/customCookieOptions';
import config from 'config';
import { connectSpotifyCommandHandler } from '../Commands/ConnectSpotify/connectSpotifyCommandHandler';
import { getSpotifyUserPlaylistsQueryHandler } from '../Queries/GetUserPlaylists/getSpotifyUserPlaylistsQueryHandler';

export const getAuthorizationCodeFromSpotifyHandler =  async (
    req: Request,
    res: Response,
    next: NextFunction) => {
        const scope = config.get<string>('spotifyScope'); 
        const clientId = config.get<string>('spotifyClientId'); 
        const redirectURI = config.get<string>('spotifyRedirectURI'); 
        const state = req.cookies.refresh_token;
        const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code&scope=${scope}&state=${state}`;
        
        res.cookie('spotify_state', state, stateCookiesOptions);
        return res.status(200).json(url);
}

export const storeSpotifyRefreshInDBAndAccessTokenInCookiesHandler = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
        const state = req.cookies.spotify_state;
        if (state !== req.query.state || !state || !req.query.state)
            return res.status(401).send();

        if (req.query.error)
            return res.status(401).json({
                status: "failed",
                message: 'Spotify access denied by user'
            })

        const code = req.query.code as string;
        try {
            const response = await connectSpotifyCommandHandler({code: code, userRefreshToken: state });
            res.cookie('spotify_access_token', response.access_token, spotifyCookiesOptions);
            return res.status(204).send(); //To do: Redirect back to the client
        } catch (error: any) {
            next(error);
    }        
}

export const getUserPlaylistHandler = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    const userId = Number(req.body.id);
    const accessToken = req.cookies.spotify_access_token;
    const page = Number(req.query.page); 
    const perPage = Number(req.query.perPage); 

    try {
        const userLibrary = await getSpotifyUserPlaylistsQueryHandler(userId, page, perPage, accessToken);
        if (userLibrary.accessToken)
            res.cookie('spotify_access_token', userLibrary.accessToken, spotifyCookiesOptions);

        return res.status(200).json({
            playLists: userLibrary.playLists,
            total: userLibrary.total,
        });
       
    } catch (error: any) {
        next(error);
    } 
}