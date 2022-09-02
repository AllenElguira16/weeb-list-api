import { Anime, AnimeRelationType, PrismaClient } from '@prisma/client';
import type { Anime as MALAnime } from 'mal-web-scraper';
import getUuidByString from 'uuid-by-string';
import { getSeason } from '@/helpers';
import { resolveImage } from './resolveImage';

const prisma = new PrismaClient();

const mapType: Record<string, Anime['type']> = {
  TV: 'TV',
  Movie: 'MOVIE',
  OVA: 'OVA',
  ONA: 'ONA',
  Special: 'SPECIAL',
};

const mapStatus: Record<string, Anime['status']> = {
  'Currently Airing': 'AIRING',
  'Finished Airing': 'COMPLETE',
  'Not yet aired': 'UPCOMING',
};

const mapRating: Record<string, Anime['rating']> = {
  'G - All Ages': 'G',
  'PG - Children': 'PG',
  'PG-13 - Teens 13 or older': 'PG13',
  'R+ - Mild Nudity': 'R',
  'Rx - Hentai': 'R18',
};

const mapAnimeRelationType: Record<
  MALAnime['anime_relations'][number]['type'],
  AnimeRelationType
> = {
  Prequel: 'PREQUEL',
  Sequel: 'SEQUEL',
  'Alternative setting': 'ALTERNATE_SETTING',
  'Alternative version': 'ALTERNATE_VERSION',
  'Side story': 'SIDE_STORY',
  Summary: 'SUMMARY',
  'Full story': 'FULL_STORY',
  'Parent story': 'PARENT_STORY',
  'Spin-off': 'SPIN_OFF',
  Character: 'CHARACTERS',
  Other: 'OTHERS',
};

export const saveAnime = async (animeID: string, anime: MALAnime) => {
  const airtime =
    anime.info.aired?.split(' to ').map((d) => new Date(d) ?? null) || [];

  const animeData = {
    id: animeID,
    type: mapType[anime.info.type || ''] || null,
    title: anime.info.main_title,
    episodes: anime.info.episodes,
    status: mapStatus[anime.info.status || ''] || null,
    picture: await resolveImage(anime.info.picture),
    airtimeFrom: airtime[0] || null,
    airtimeTo: airtime[1] || null,
    duration: anime.info.duration,
    season: airtime ? getSeason(airtime[0]) : null,
    rating: mapRating[anime.info.rating || ''] || null,
    genres: anime.info.genres,
    themes: anime.info.themes,
    demographics: anime.info.demographics,
    synopsis: anime.info.synopsis,
  };

  await prisma.anime.upsert({
    where: {
      id: animeID,
    },
    update: animeData,
    create: animeData,
  });

  for (const relations of anime.anime_relations) {
    const relationAnimeID = getUuidByString(relations.anime_id.toString());

    const relationData = {
      animeId: animeID,
      relatedAnimeId: relationAnimeID,
      type: mapAnimeRelationType[relations.type],
    };

    const relationDB = await prisma.anime.findFirst({
      where: { id: relationAnimeID },
    });

    if (relationDB)
      await prisma.animeRelations.create({
        data: relationData,
      });
  }
};
