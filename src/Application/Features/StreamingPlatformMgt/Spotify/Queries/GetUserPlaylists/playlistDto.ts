export type PlaylistDto = {
    description: string,
    id: string,
    imageUrl: string,
    name: string,
    owner: string,
    snapshotId: string,
    tracks: {
        url: string,
        total: string
    }
}

