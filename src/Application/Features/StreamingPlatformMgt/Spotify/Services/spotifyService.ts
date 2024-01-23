import { SpotifyOAuthDto } from '../Commands/ConnectSpotify/spotifyOAuthDto';
import config from 'config';
import qs from "qs";
import axios from "axios";
import { NOT_FOUND, UNAUTHORIZED } from 'http-status';
import { SpotifyUserId } from '../Commands/ConnectSpotify/spotifyUserId';
import { PlaylistDto } from '../Queries/GetUserPlaylists/playlistDto';
import { LibraryDto } from '../Queries/GetUserPlaylists/libraryDto';
import logger from 'src/Shared/Infrastructure/logger';
import { PlaylistTracksDto } from '../Queries/GetPlaylistTracks/playlistTracksDto';
import { url } from 'inspector';
import { TrackDto } from '../Queries/GetPlaylistTracks/trackDto';
import { PlaylistTracksSchemaType } from 'src/Domain/Validations/streamingPlatform.validation';
import { TuneSyncError } from 'src/Domain/Exceptions/tuneSyncError';
import { ErrorCode } from 'src/Domain/Exceptions/errorCode';

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
        'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')      },
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
        logger.info(err.response.data);
        throw new Error(err.response.data);
    }
  }

  async getUserProfileData (accessToken: string): Promise<SpotifyUserId> {
    const authOptions = {
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        //'Content-Type': 'application/json'
      },
      json: true
    };
  
    try {
        const { data } = await axios.get<SpotifyUserId>(
          authOptions.url,
          { headers: authOptions.headers }
        );

        return data;
      } catch (err: any) {
        throw new Error(err);
    }
  }

  async getUserPlaylist(accessToken: string, refreshToken: string, userId: string, page: number, perPage: number): Promise<LibraryDto> {
    const offset = (page - 1) * perPage;
    let newTokens: SpotifyOAuthDto | null = null;
    if (!accessToken || accessToken === undefined)
    {
         newTokens = await this.#getNewAccessToken(refreshToken);
         accessToken = newTokens.access_token;
    }
    
    const authOptions = {
      url: `https://api.spotify.com/v1/users/${userId}/playlists?offset=${offset}&limit=${perPage}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        //'Content-Type': 'application/json'
      },
      json: true
    };

    try {
      let { data, status } = await axios.get(
        authOptions.url,
        { headers: authOptions.headers }
      );

      
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

  async #getPlaylist(playlistId: string, accessToken: string, refreshToken: string):
    Promise<PlaylistTracksSchemaType> {
    let newTokens: SpotifyOAuthDto | null = null;
    const authOptions = {
      url: `https://api.spotify.com/v1/playlists/${playlistId}?fields=description,name,id,images`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        //'Content-Type': 'application/json'
      },
      json: true
    };

    try {
      
      if (!accessToken || accessToken === undefined)
      {
           newTokens = await this.#getNewAccessToken(refreshToken);
           accessToken = newTokens.access_token;
      }

      let { data, status } = await axios.get(
        authOptions.url,
        { headers: authOptions.headers }
      );
      
      if (status === UNAUTHORIZED) {
          newTokens = await this.#getNewAccessToken(refreshToken);
          authOptions.headers.Authorization = `Bearer ${newTokens.access_token}`;
          data = await axios.get(
            authOptions.url,
            { headers: authOptions.headers }
          );  
      }

      const playlistDetails: PlaylistTracksSchemaType = {
        name: data.name,
        description: data.description,
        playlistId: data.id,
        imageURL: data.images[0],
        accessToken: newTokens !== null ? newTokens.access_token : accessToken,
        refreshToken: newTokens !== null ? newTokens.refresh_token : refreshToken,
      }

      return playlistDetails;

    } catch (error: any) {
      logger.info(error.response.data);

      if (error.response.status === 400) 
        throw new TuneSyncError(new ErrorCode("SpotifyPlayListNotFound", "Spotify playlist does not exist", NOT_FOUND));
      
      throw error;
    }
  }

  async getPlayListTracks(playlistDetails: PlaylistTracksSchemaType, refreshToken: string, page: string, perPage: string): 
    Promise<PlaylistTracksDto> {

      playlistDetails = await this.#getPlaylist(playlistDetails.playlistId, playlistDetails.accessToken!, refreshToken);

      const offset = (Number(page) - 1) * Number(perPage);
      const authOptions = {
        url: `https://api.spotify.com/v1/playlists/${playlistDetails.playlistId}/tracks?offset=${offset}&limit=${perPage}`,
        headers: {
          'Authorization': `Bearer ${playlistDetails.accessToken}`,
          //'Content-Type': 'application/json'
        },
        json: true
      };

      try {
        let { data } = await axios.get(
          authOptions.url,
          { headers: authOptions.headers }
        );
         
        const tracks: TrackDto[] = data.items.map((item: any) => ({
          artist: item.track.artists.reduce((accumulator: string, artist: { name: string }) => accumulator + artist.name + ', ', '').slice(0, -2),
          nameOfTrack: item.track.name,
          sourceIdOfTrack: item.track.id
      }));

      const playlistDto: PlaylistTracksDto = {
        name: playlistDetails.name!,
        description: playlistDetails.description!,
        imageUrl: playlistDetails.imageURL!,
        tracks: tracks,
        accessToken: playlistDetails.accessToken!,
        total: data.total as number
      }
      
      return playlistDto;

      } catch (error: any) {;
        throw error;
      }
  }
}

export default new SpotifyService()