//? CineVerse\src\app\movies\interfaces\movie-details.interface.ts

export interface TmdbMovieDetails {
  adult: boolean;
  backdrop_path: string | null;

  belongs_to_collection: TmdbBelongsToCollection | null;

  budget: number;

  genres: TmdbGenre[];

  homepage: string | null;

  id: number;
  imdb_id: string | null;

  original_language: string;
  original_title: string;

  overview: string | null;

  popularity: number;

  poster_path: string | null;

  production_companies: TmdbProductionCompany[];
  production_countries: TmdbProductionCountry[];

  release_date: string; // yyyy-mm-dd
  revenue: number;
  runtime: number | null;

  spoken_languages: TmdbSpokenLanguage[];

  status: TmdbMovieStatus;
  tagline: string | null;
  title: string;

  video: boolean;
  vote_average: number;
  vote_count: number;
}

/** Colección a la que pertenece la película (si aplica) */
export interface TmdbBelongsToCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

/** Género TMDB */
export interface TmdbGenre {
  id: number;
  name: string;
}

/** Productora */
export interface TmdbProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string; // ISO 3166-1 alpha-2
}

/** País de producción */
export interface TmdbProductionCountry {
  iso_3166_1: string; // e.g. "US"
  name: string;
}

/** Idioma hablado */
export interface TmdbSpokenLanguage {
  iso_639_1: string;      // e.g. "en"
  name: string;           // nombre local
  english_name: string;   // nombre en inglés
}

/** Estados habituales en TMDB */
export type TmdbMovieStatus =
  | 'Rumored'
  | 'Planned'
  | 'In Production'
  | 'Post Production'
  | 'Released'
  | 'Canceled';
