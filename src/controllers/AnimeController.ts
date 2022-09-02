import { Controller } from '@tsed/di';
import { PathParams, QueryParams, RawQueryParams } from '@tsed/platform-params';
import { ContentType, Get, Status } from '@tsed/schema';
import { Anime } from '@prisma/client';
import { AnimeService } from '@/services';

@Controller('/anime')
export class AnimeController {
  constructor(private animeService: AnimeService) {}

  @Get('/')
  @ContentType('application/json')
  @Status(200).Description('Nice')
  async getAnimeData(
    @RawQueryParams('type') type: Anime['type'],
    @RawQueryParams('status') status: Anime['status'],
    @RawQueryParams('season') season: Anime['season'],
    @QueryParams('explicit') explicit: boolean = false,
    @RawQueryParams('sortType') sortType: 'asc' | 'desc' = 'asc',
    @QueryParams('orderBy') orderBy: keyof Anime = 'title',
    @QueryParams('page') page: number = 1,
    @QueryParams('limit') limit: number = 10,
    @QueryParams('search') search: string = '',
  ) {
    const [totalAnime, anime] = await this.animeService.getAnimeList(
      page,
      limit,
      search,
      explicit,
      { sortType, orderBy },
      {
        type,
        status,
        season,
      },
    );

    return {
      status: 200,
      data: {
        pagination: {
          totalAnime: totalAnime,
          totalPages: totalAnime < limit ? 1 : Math.ceil(totalAnime / limit),
          currentPage: page,
        },
        anime,
      },
    };
  }

  @Get('/random')
  @ContentType('application/json')
  @Status(200)
  async getRandomAnime(
    @QueryParams('limit') limit: number = 10,
    @QueryParams('explicit') explicit: boolean = false,
  ) {
    return {
      status: 200,
      data: {
        anime: await this.animeService.getRandomAnimeList(limit, explicit),
      },
    };
  }

  @Get('/:id')
  @ContentType('application/json')
  @Status(200)
  async getAnimeByID(@PathParams('id') id: string) {
    return {
      status: 200,
      data: {
        anime: await this.animeService.getAnimeByID(id),
      },
    };
  }
}
