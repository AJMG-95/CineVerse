//? CineVerse\src\app\shared\interfaces\images.interface.ts

/**
 * Imagen TMDB genérica (aplica a posters, backdrops, logos, profiles, stills)
 * Así lo devuelve TMDB en todos los endponts de /(movie|tv|person|...)/{id}/images
 */
export interface TmdbImage {
  aspect_ratio: number;
  file_path: string; // ruta relativa
  height: number;
  width: number;
  iso_639_1: string | null; // idioma (para posters/logos)
  vote_average: number; // media de votos de la imagen
  vote_count: number; // nº de votos de la imagen
}

/**
 * Respuesta de imágenes para PELÍCULAS
 */
export interface TmdbMovieImages {
  id: number;
  backdrops: TmdbImage[];
  posters: TmdbImage[];
  logos: TmdbImage[];
}

/**
 * Respuesta de imágenes para SERIES
 */
export interface TmdbTvImages {
  id: number;
  backdrops: TmdbImage[];
  posters: TmdbImage[];
  logos: TmdbImage[];
}

/**
 * Respuesta de imágenes para PERSONAS
 */
export interface TmdbPersonImages {
  id: number;
  profiles: TmdbImage[];
}

/**
 * Respuesta de imágenes para EPISODIOS
 */
export interface TmdbEpisodeImages {
  id: number;
  stills: TmdbImage[]; //Fotogramas
}

/* =========================
  Tamaños oficiales
  Útiles para tipar helpers/pipes
========================= */

/** Tamaños de poster */
export type TmdbPosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

/** Tamaños de backdrop */
export type TmdbBackdropSize = 'w300' | 'w780' | 'w1280' | 'original';

/** Tamaños de logo */
export type TmdbLogoSize = 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';

/** Tamaños de perfil (person.profile) */
export type TmdbProfileSize = 'w45' | 'w185' | 'h632' | 'original';

/** Tamaños de still (episodios) */
export type TmdbStillSize = 'w92' | 'w185' | 'w300' | 'original';

/** Tipo de imagen para utilidades genéricas */
export type TmdbImageCategory = 'poster' | 'backdrop' | 'logo' | 'profile' | 'still';
