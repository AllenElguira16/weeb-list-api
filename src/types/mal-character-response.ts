export type MALAnimeCharactersResponse = {
  data: {
    character: {
      mal_id: number;
      url: string;
      images: {
        jpg: {
          image_url: string;
        };
        webp: {
          image_url: string;
          small_image_url: string;
        };
      };
      name: string;
    };
    role: 'Main' | 'Supporting';
    voice_actors: {
      person: {
        mal_id: 357;
        url: string;
        images: {
          jpg: {
            image_url: string;
          };
        };
        name: string;
      };
      language: string;
    }[];
  }[];
};

export type MALCharactersResponse = {
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
  data: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
      };
    };
    name: string;
    name_kanji: string;
    nicknames: [];
    favorites: number;
    about: string;
  }[];
};

export type MALCharactersFullResponse = {
  data: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
      };
    };
    name: string;
    name_kanji: string;
    nicknames: string[];
    favorites: number;
    about: string;
    anime: {
      role: string;
      anime: {
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
        title: string;
      };
    }[];
    manga: {
      role: string;
      manga: {
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
        title: string;
      };
    }[];
    voices: {
      person: {
        mal_id: number;
        url: string;
        images: {
          jpg: {
            image_url: string;
          };
        };
        name: string;
      };
      language: string;
    }[];
  };
};
