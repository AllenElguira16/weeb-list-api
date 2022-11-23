import { Anime, Prisma, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';

const prisma = new PrismaClient();

@Injectable()
export class AnimeService {
  async getAnimeByID(id: string) {
    return prisma.anime.findFirstOrThrow({
      include: {
        characters: {
          orderBy: {
            role: 'asc',
          },
          include: {
            character: {
              include: {
                voiceActors: {
                  where: {
                    language: 'Japanese',
                  },
                  include: {
                    person: true,
                  },
                },
              },
            },
          },
        },
        staffs: {
          include: {
            person: true,
          },
        },
        otherTitles: true,
      },
      where: {
        id,
      },
    });
  }

  async getAnimeList(
    page: number,
    limit: number,
    search: string,
    explicit: boolean,
    sort: { sortType: 'asc' | 'desc'; orderBy: keyof Anime },
    animeParams: Partial<Pick<Anime, 'type' | 'status' | 'season'>>,
  ): Promise<[number, Anime[]]> {
    const offset = (page - 1) * limit;

    let where: Prisma.AnimeFindManyArgs['where'] = {
      ...animeParams,
    };

    if (search.length !== 0) {
      where = {
        ...where,
        OR: [
          {
            title: {
              startsWith: search,
              mode: 'insensitive',
            },
          },
          {
            otherTitles: {
              some: {
                title: {
                  startsWith: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      };
    }

    if (!explicit) {
      where = {
        ...where,
        NOT: {
          rating: 'R18',
        },
      };
    }

    Object.keys(animeParams).forEach((keys: keyof typeof animeParams) => {
      if (animeParams[keys]) {
        where = {
          ...where,
          [keys]: animeParams[keys],
        };
      }
    });

    return [
      await prisma.anime.count({
        where: where,
      }),
      await prisma.anime.findMany({
        take: limit,
        skip: offset,
        where: where,
        orderBy: {
          [sort.orderBy]: sort.sortType,
        },
      }),
    ];
  }

  // NOTE: Prisma does not support random as of the moment
  async getRandomAnimeList(count: number, explicit: boolean) {
    if (!explicit)
      return prisma.$queryRaw`SELECT * FROM public."Anime" WHERE rating != 'R18' ORDER BY random() LIMIT ${count}`;

    return prisma.$queryRaw`SELECT * FROM public."Anime" ORDER BY random() LIMIT ${count}`;
  }
}
