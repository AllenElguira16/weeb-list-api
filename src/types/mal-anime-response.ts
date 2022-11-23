export type MALAnimeSearchResponse = {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  data: ({
    mal_id: number;
    url: string;
    images: Record<
      string,
      {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      }
    >;
    trailer: {
      youtube_id: string | null;
      url: string | null;
      embed_url: string | null;
      images: {
        image_url: string | null;
        small_image_url: string | null;
        medium_image_url: string | null;
        large_image_url: string | null;
        maximum_image_url: string | null;
      };
    };
    title: string;
    title_english: string | null;
    title_japanese: string | null;
    title_synonyms: string[];
    type: string | null;
    source: string;
    episodes: number | null;
    status: string;
    airing: true;
    aired: {
      from: string | null;
      to: string | null;
      prop: Record<
        string,
        {
          day: number | null;
          month: number | null;
          year: number | null;
        }
      >;
      string: string;
    };
    duration: 'Unknown' | string;
    rating: string | null;
    score: number;
    scored_by: number;
    rank: number;
    popularity: number;
    members: number;
    favorites: number;
    synopsis: string;
    background: string;
    season: string;
    year: number;
    broadcast: {
      day: string;
      time: string;
      timezone: string;
      string: string;
    };
  } & Record<
    string,
    {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[]
  >)[];
};
