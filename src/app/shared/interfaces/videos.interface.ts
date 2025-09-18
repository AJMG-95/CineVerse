//? CineVerse\src\app\shared\interfaces\videos.interface.ts

/**
 * Sitios habituales donde TMDB aloja los vídeos.
 */
export type TmdbVideoSite = 'YouTube' | 'Vimeo' | string;

/**
 * Tipos de vídeo más comunes en TMDB.
 */
export type TmdbVideoType =
  | 'Trailer'
  | 'Teaser'
  | 'Clip'
  | 'Featurette'
  | 'Behind the Scenes'
  | 'Bloopers'
  | 'Opening Credits'
  | 'Recap'
  | string;

/**
 * Elemento de vídeo individual (aparece dentro de "results")
 * Estructura común para películas, series, temporadas y episodios.
 */
export interface TmdbVideo {
  id?: string;
  iso_639_1: string;         // idioma
  iso_3166_1: string;        // país
  name: string;              // título del vídeo
  key: string;               // clave del vídeo (p. ej. ID de YouTube)
  site: TmdbVideoSite;       // "YouTube" | "Vimeo" | ...
  size: 360 | 480 | 720 | 1080 | 2160 | 4320 | number; // resolución (px)
  type: TmdbVideoType;
  official?: boolean;
  published_at?: string;
}

/**
 * Contenedor genérico de vídeos
 */
export interface TmdbVideos {
  id: number;
  results: TmdbVideo[];
}

/** Alias útiles por contexto/enpoint*/
export type TmdbMovieVideos = TmdbVideos; // /movie/{id}/videos
export type TmdbTvVideos = TmdbVideos; // /tv/{id}/videos
export type TmdbSeasonVideos = TmdbVideos; // /tv/{id}/season/{season_number}/videos
export type TmdbEpisodeVideos = TmdbVideos; // /tv/{id}/season/{s}/episode/{e}/videos

/**
 * Helpers de URL de reproducción para YouTube/Vimeo:
 * Usarlos en pipes o utils para generar enlaces embebibles.
 */
export const tmdbVideoUrl = (v: TmdbVideo): string => {
  if (v.site === 'YouTube') return `https://www.youtube.com/watch?v=${v.key}`;
  if (v.site === 'Vimeo') return `https://vimeo.com/${v.key}`;
  return '';
};

export const tmdbVideoEmbedUrl = (v: TmdbVideo): string => {
  if (v.site === 'YouTube') return `https://www.youtube.com/embed/${v.key}`;
  if (v.site === 'Vimeo') return `https://player.vimeo.com/video/${v.key}`;
  return '';
};
