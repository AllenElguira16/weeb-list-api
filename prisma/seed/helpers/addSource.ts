import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addSource = async () => {
  for (const anime of await prisma.anime.findMany()) {
    await prisma.anime.update({
      where: {
        id: anime.id,
      },
      data: {
        ...anime,
        synopsis:
          anime.synopsis
            ?.replace(/\[Written by MAL Rewrite\]/, '(Source: MyAnimeList)')
            ?.replace(
              '(Source: ANN, edited)',
              '(Source: AnimeNewsNetwork (ANN))',
            )
            ?.replace('(Source: ANN)', '(Source: AnimeNewsNetwork (ANN))') ||
          null,
      },
    });
  }
};
