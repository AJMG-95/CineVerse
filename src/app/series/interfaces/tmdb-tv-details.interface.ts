// tv-details.interface.ts
export interface TmdbTvDetails {
  adult: boolean;
  backdrop_path: string | null;
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number | null;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  first_air_date: string; // YYYY-MM-DD
  genres: { id: number; name: string }[];
  homepage: string | null;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string | null;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string | null;
    episode_number: number;
    episode_type?: string;
    production_code?: string;
    runtime?: number | null;
    season_number: number;
    show_id: number;
    still_path: string | null;
  } | null;
  name: string;
  next_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string | null;
    episode_number: number;
    episode_type?: string;
    production_code?: string;
    runtime?: number | null;
    season_number: number;
    show_id: number;
    still_path: string | null;
  } | null;
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  seasons: {
    air_date: string | null;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string; // "Returning Series", "Ended", etc.
  tagline: string;
  type: string; // "Scripted", etc.
  vote_average: number;
  vote_count: number;

  // Append extras si usas bundle
  credits?: {
    cast: any[];
    crew: any[];
  };
  aggregate_credits?: {
    cast: any[];
    crew: any[];
  };
  images?: {
    backdrops: { file_path: string; vote_average: number; width: number; height: number }[];
    posters: { file_path: string; vote_average: number; width: number; height: number }[];
    logos: { file_path: string; vote_average: number; width: number; height: number }[];
  };
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
      published_at: string;
    }[];
  };
  recommendations?: { results: any[] };
  similar?: { results: any[] };
  reviews?: { results: any[] };
  external_ids?: Record<string, string | null>;
  content_ratings?: { results: { iso_3166_1: string; rating: string }[] };

  // Normalizado por tu servicio
  watchProviders?: {
    results: Record<
      string,
      {
        link: string;
        flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
        buy?: { provider_id: number; provider_name: string; logo_path: string }[];
        rent?: { provider_id: number; provider_name: string; logo_path: string }[];
      }
    >;
  };
}
