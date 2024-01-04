import { PrismaClient, Prisma, UserConnectedStreamingPlatform, StreamingPlatform} from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

// Add an event listener to capture the SQL queries
prisma.$on('query', (e) => {
  console.log('SQL Query:', e.query);
});

export const createUserStreamingPlatform = async (input: Prisma.UserConnectedStreamingPlatformCreateInput) => {
    return (await prisma.userConnectedStreamingPlatform.create({
      data: {
        streamingPlatform: input.streamingPlatform,
        streamingPlatformRefreshToken: input.streamingPlatformRefreshToken,
        streamingPlatformUserId: input.streamingPlatformUserId,
        user: input.user    
      }
    })) as UserConnectedStreamingPlatform;
  };

  export const findConnectedStreamingPlatformByUserId = async (userId: number) => {
    return (await prisma.userConnectedStreamingPlatform.findFirst({
      where: { userId: userId,streamingPlatform: StreamingPlatform.Spotify },
    })) as UserConnectedStreamingPlatform;
  };

  export const doesConnectedStreamingPlatformExists = async (userId: number) => {
    const count = await prisma.userConnectedStreamingPlatform.count({
      where: { userId: userId, streamingPlatform: StreamingPlatform.Spotify },
    });
   
    if (count > 0) {
      return true;
    } else {
      return false;
    }
   }

  export const updateRefreshToken = async (token: string, streamingPlatformId: number) => {
    await prisma.userConnectedStreamingPlatform.update({
      where: { id: streamingPlatformId },
      data: {
        streamingPlatformRefreshToken: token,
      },
    }); 
  }
  