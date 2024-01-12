import { NextFunction, Request, Response } from 'express';
import config from 'config';
import { stateCookiesOptions } from 'src/Infrastructure/Utilities/customCookieOptions';
import { connectDeezerCommandHandler } from '../Commands/ConnectDeezer/connectDeezerCommandHandler';
import { getDeezerUserPlaylistsQueryHandler } from '../Queries/GetUserPlaylists/getDeezerUserPlaylistsQueryHandler';
import logger from 'src/Shared/Infrastructure/logger';


export const getAuthorizationCodeFromDeezerHandler =  async (
    req: Request,
    res: Response,
    next: NextFunction) => {
        const permissions = config.get<string>('deezerScope'); 
        const appId = config.get<string>('deezerAppId'); 
        const redirectURI = config.get<string>('deezerRedirectURI'); 
        const url = `https://connect.deezer.com/oauth/auth.php?app_id=${appId}&redirect_uri=${redirectURI}&perms=${permissions}`;
        const state = req.cookies.refresh_token;
        res.cookie('deezer_state', state, stateCookiesOptions);
        logger.info(state);
        return res.status(200).json(url);
}

export const storeDeezerAccessTokenInDBHandler = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
        const state = req.cookies.deezer_state;
        if (!state)
            return res.status(401).json({message: "Please log in before you can connect your deezer account"});

        if (req.query.error_reason || req.query.error_reason === 'user_denied')
            return res.status(401).json({
                status: "failed",
                message: 'Deezer access denied by user'
            })

        const code = req.query.code as string;
        logger.info(code);
        try {
            await connectDeezerCommandHandler({code: code, userRefreshToken: state });
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
    const page = Number(req.query.page); 
    const perPage = Number(req.query.perPage); 

    try {
        const userLibrary = await getDeezerUserPlaylistsQueryHandler(userId, page, perPage);
        return res.status(200).json({
            playLists: userLibrary.playLists,
            total: userLibrary.total,
        });       
    } catch (error: any) {
        next(error);
    } 
}