import { SpotifyOAuthDto } from '../Commands/ConnectSpotify/spotifyOAuthDto';
import config from 'config';
import qs from "qs";
import axios from "axios";
import { UNAUTHORIZED } from 'http-status';
import { SpotifyUserId } from '../Commands/ConnectSpotify/spotifyUserId';
import { PlaylistDto } from '../Queries/GetUserPlaylists/playlistDto';
import { LibraryDto } from '../Queries/GetUserPlaylists/libraryDto';
import logger from 'src/Shared/Infrastructure/logger';

class SpotifyService {
  private clientId;
  private clientSecret;

  constructor() {
      this.clientId = config.get<string>('spotifyClientId').toString();

      this.clientSecret = config.get<string>('spotifyClientSecret').toString();
  }

  async getSpotifyUserAccessAndRefreshToken(code: string): Promise<SpotifyOAuthDto> {    
    
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')
      },
      form: {
        grant_type: 'authorization_code',
        redirect_uri: config.get<string>('spotifyRedirectURI'),
        code: code
      },
      json: true
    };  
    
    logger.info(authOptions.headers);
  
    try {
          const { data } = await axios.post<SpotifyOAuthDto>(
              authOptions.url,
              qs.stringify(authOptions.form),
              { headers: authOptions.headers }
            );
        
            return data;
      } catch (err: any) {
          throw new Error(err);
    }
  }

  async #getNewAccessToken (refreshToken: string): Promise<SpotifyOAuthDto> {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'))
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      json: true
    };

    try {
        const { data } = await axios.post<SpotifyOAuthDto>(
          authOptions.url,
          qs.stringify(authOptions.form),
          { headers: authOptions.headers }
        );
    
        return data;
      } catch (err: any) {
        throw new Error(err);
    }
  }

  async getUserProfileData (accesToken: string): Promise<SpotifyUserId> {
    const authOptions = {
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': `Bearer ${accesToken}`,
        //'Content-Type': 'application/json'
      },
      json: true
    };
  
    try {
        const { data } = await axios.get<SpotifyUserId>(
          authOptions.url,
          { headers: authOptions.headers }
        );

        console.log(data);
        return data;
      } catch (err: any) {
        throw new Error(err);
    }
  }

  async getUserPlaylist(accesToken: string, refreshToken: string, userId: string, page: number, perPage: number): Promise<LibraryDto> {
    const offset = (page - 1) * perPage;
    const authOptions = {
      url: `https://api.spotify.com/v1/users/${userId}/playlists?offset=${offset}&limit=${perPage}`,
      headers: {
        'Authorization': `Bearer ${accesToken}`,
        //'Content-Type': 'application/json'
      },
      json: true
    };

    try {
      let { data, status } = await axios.get(
        authOptions.url,
        { headers: authOptions.headers }
      );

      let newTokens: SpotifyOAuthDto | null = null;
      if (status === UNAUTHORIZED) {
          newTokens = await this.#getNewAccessToken(refreshToken);
          authOptions.headers.Authorization = `Bearer ${newTokens.access_token}`;
          data = await axios.get(
            authOptions.url,
            { headers: authOptions.headers }
          );  
      }

      const playlists: PlaylistDto[] = data.items.map((item: any) => ({
        description: item.description,
        id: item.id,
        imageUrl: item.images[0].url,
        name: item.name,
        owner: item.owner.display_name,
        snapshotId: item.snapshot_id,
        tracks: {
            url: item.tracks.href,
            total: item.tracks.total
        }
    }));

    const userLibrary: LibraryDto = {
      playLists: playlists,
      accessToken: newTokens !== null ? newTokens.access_token : null,
      refreshToken: newTokens !== null ? newTokens.refresh_token : null,
      total: data.total
    } 

      return userLibrary;
    } catch (err: any) {
        throw new Error(err);
    }
  }
}

export default new SpotifyService()