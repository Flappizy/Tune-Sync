import config from 'config';
import { DeezerOAuthDto } from '../Commands/ConnectDeezer/deezerOauthDto';
import axios from "axios";
import { LibraryDto } from '../../Spotify/Queries/GetUserPlaylists/libraryDto';
import { PlaylistDto } from '../../Spotify/Queries/GetUserPlaylists/playlistDto';
import logger from 'src/Shared/Infrastructure/logger';
import { DeezerUserId } from '../Commands/ConnectDeezer/deezerUserId';

class DeezerService {
    private appId;
    private appSecret;
    
    constructor() {
        this.appId = config.get<string>('deezerAppId').toString();
  
        this.appSecret = config.get<string>('deezerSecretKey').toString();
    }

    async getDeezerUserAccessToken(code: string): Promise<DeezerOAuthDto> {
        const url = `https://connect.deezer.com/oauth/access_token.php?app_id=${this.appId}&secret=${this.appSecret}&code=${code}`;
        
        try {
            const { data } = await axios.get(url);
            const match = data.match(/access_token=([^&]*)/);
            let accessToken: string | null = null;
            if (match && match[1]) {
              accessToken = match[1];              
            }
            return { access_token: accessToken! };
        } catch (err: any) {
            throw new Error(err);
      }
    }

    async getDeezerUserId(access_token: string): Promise<DeezerUserId> {
       const url = `https://api.deezer.com/user/me?access_token=${access_token}`;
      try {
        const { data } = await axios.get<DeezerUserId>(url);
        return data;
      } catch (err: any) {
        throw new Error(err);
      }
    }

    async getUserPlaylist(accesToken: string, page: number, perPage: number): Promise<LibraryDto> {
        const offset = (page - 1) * perPage;
        const url = `https://api.deezer.com/user/me/playlists?access_token=${accesToken}&index=${offset}`;

    
        try {
          let { data } = await axios.get(url);
    
          const playlists: PlaylistDto[] = data.data.map((item: any) => ({
            description: item.title,
            id: item.id,
            imageUrl: item.picture,
            name: item.title,
            owner: item.creator.name,
            tracks: {
                url: item.tracklist,
                total: item.nb_tracks
            }
        }));
    
        const userLibrary: LibraryDto = {
          playLists: playlists,
          accessToken: null,
          refreshToken: null,
          total: data.total
        } 
    
          return userLibrary;
        } catch (err: any) {
            throw new Error(err);
        }
      }
}

export default new DeezerService();