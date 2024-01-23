import { TypeOf, z } from 'zod';

export const playlistTracksSchema = z.object({
    playlistId: z.string(),
    perPage: z.string().optional().refine(value => !isNaN(Number(value)), {
        message: 'perPage must be a number',
    }),
    page: z.string().optional().refine(value => !isNaN(Number(value)), {
        message: 'page must be a number',
    }),
    name: z.string().optional(),
    description: z.string().optional(),
    imageURL: z.string().optional(),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
});

export type StreamingPlatformConnect = {
    code: string,
    userRefreshToken: string
}
export type PlaylistTracksSchemaType = TypeOf<typeof playlistTracksSchema>;