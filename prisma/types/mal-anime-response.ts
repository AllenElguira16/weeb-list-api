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

export type MALAnimeFullResponse = {
  data: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    trailer: {
      youtube_id: string;
      url: string;
      embed_url: string;
    };
    approved: boolean;
    titles: string[];
    title: string;
    title_english: string | null;
    title_japanese: string | null;
    title_synonyms: string[];
    type: string | null;
    source: string | null;
    episodes: number | null;
    status: string | null;
    airing: boolean;
    aired: {
      from: string | null;
      to: string | null;
      prop: {
        from: {
          day: number;
          month: number;
          year: number;
        } | null;
        to: {
          day: number;
          month: number;
          year: number;
        } | null;
        string: string | null;
      };
    };
    duration: string | null;
    rating: string | null;
    score: number | null;
    scored_by: number | null;
    rank: number | null;
    popularity: number | null;
    members: number | null;
    favorites: number | null;
    synopsis: string | null;
    background: string | null;
    season: string | null;
    year: number | null;
    broadcast: {
      day: string;
      time: string;
      timezone: string;
      string: string;
    } | null;
    producers: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    licensors: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    studios: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    genres: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    explicit_genres: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    themes: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    demographics: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    relations: {
      relation: string;
      entry: {
        mal_id: number;
        type: string;
        name: string;
        url: string;
      }[];
    }[];
    theme: {
      openings: string[];
      endings: string[];
    } | null;
    external: {
      name: string;
      url: string;
    }[];
    streaming: {
      name: string;
      url: string;
    }[];
  };
};
