import { PrismaClient } from '@prisma/client';
import type { Anime as MALAnime } from 'mal-web-scraper';

const prisma = new PrismaClient();

export const saveTitle = async (
  animeID: string,
  alternativeTitles: MALAnime['info']['alternative_titles'],
) => {
  for (const languageKey of Object.keys(alternativeTitles)) {
    const languageCount = await prisma.title.count({
      where: {
        language: languageKey,
        title: alternativeTitles[languageKey] as string,
        animeId: animeID,
      },
    });

    if (languageCount === 0)
      await prisma.title.create({
        data: {
          language: languageKey,
          title: alternativeTitles[languageKey] as string,
          animeId: animeID,
        },
      });
  }
};
