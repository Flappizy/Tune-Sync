import { TrackDto } from "./trackDto"

export type PlaylistTracksDto = {
    name: string,
    description: string,
    tracks: TrackDto[] | null,
    imageUrl: string,
    accessToken: string | null,
    total: number
}