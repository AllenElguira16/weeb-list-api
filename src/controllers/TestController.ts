import { Controller } from '@tsed/di';
import { ContentType, Get } from '@tsed/schema';
import malScrapper from 'mal-scraper';
// import axios from "axios";

@Controller('/test')
export class TestController {
  @Get('/')
  @ContentType('application/json')
  async testGetAnime() {
    const data = await malScrapper.getInfoFromURL(
      'https://myanimelist.net/anime/1',
    );

    // const { data } = await axios.get(
    //   "https://api.myanimelist.net/v2/anime/38040?fields=id,staff,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics",
    //   {
    //     headers: {
    //       "X-MAL-CLIENT-ID": "dcd46c2f772c229338d897853f16e269"
    //     }
    //   }
    // );

    return data;
  }
}
