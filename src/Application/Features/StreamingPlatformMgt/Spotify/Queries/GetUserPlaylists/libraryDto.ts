import { PlaylistDto } from "./playlistDto"

export type LibraryDto = {
    playLists: PlaylistDto[],
    total: number,
    accessToken: string | null,
    refreshToken: string | null
}