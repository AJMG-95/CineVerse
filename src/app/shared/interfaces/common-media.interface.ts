//?CineVerse\src\app\shared\interfaces\common-media.interface.ts

/**
 * Tipo de medio básico
 */
export type TmdbMediaType = 'movie' | 'tv' | 'person';


/**
 * Género TMDB (compartido por movie y tv)
 */
export interface TmdbGenresResponse {
  genres: TmdbGenre[];
}

export interface TmdbGenre {
  id: number;
  name: string;
}

/**
 * Productora
 */
export interface TmdbProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string; // Código país, p.ej. "US", "ES"
}

/**
 * País de producción
 */
export interface TmdbProductionCountry {
  iso_3166_1: string; // Código país, p.ej. "US" */
  name: string;
}

/**
 * Idioma hablado
 */
export interface TmdbSpokenLanguage {
  iso_639_1: string; // Código idioma, p.ej. "en", "es"
  english_name: string; // Nombre del idioma en inglés
  name: string; // Nombre local, p.ej. "Español"
}

/**
 * Identificadores externos.
 * TMDB devuelve distintos campos según el recurso:
 * - Movie: imdb_id, wikidata_id, facebook_id, instagram_id, twitter_id…
 * - Series (TV):    tvdb_id, imdb_id (a veces null), wikidata_id, social…
 * - Person: también varía.
 */

export interface TmdbExternalIds {
  imdb_id?: string | null;
  wikidata_id?: string | null;

  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;

  tvdb_id?: number | null; // Suele aparecer solo en las series (TV)
}


export type TmdbReview = {
  id: string; author: string; content: string; url: string;
  author_details?: { rating?: number; username?: string; avatar_path?: string | null };
};
