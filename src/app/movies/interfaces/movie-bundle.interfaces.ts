import {
  TmdbCredits,
  TmdbExternalIds,
  TmdbMovieImages,
  TmdbPaged,
  TmdbReview,
  TmdbVideos,
} from '@shared/interfaces/barrel';
import { TmdbWatchProviders } from '@shared/interfaces/watch-providers.interface';
import { TmdbMovieDetails } from './movie-details.interface';
import { TmdbMovie } from './movie.interface';

/* =========================================
  1) RAW: coincide con la respuesta de TMDB
========================================= */
export interface TmdbMovieBundleRaw extends TmdbMovieDetails {
  credits: TmdbCredits;
  images: TmdbMovieImages;
  videos: TmdbVideos;

  similar: TmdbPaged<TmdbMovie>;
  recommendations: TmdbPaged<TmdbMovie>;
  reviews: TmdbPaged<TmdbReview>;

  external_ids?: TmdbExternalIds;
  release_dates?: TmdbReleaseDates;

  /** TMDB devuelve esta clave con una barra "/" */
  ['watch/providers']?: TmdbWatchProviders;
}

/* =========================================
  2) NORMALIZADO: clave amigable para la app
========================================= */
export interface TmdbMovieBundle extends TmdbMovieDetails {
  credits: TmdbCredits;
  images: TmdbMovieImages;
  videos: TmdbVideos;

  similar: TmdbPaged<TmdbMovie>;
  recommendations: TmdbPaged<TmdbMovie>;
  reviews: TmdbPaged<TmdbReview>;

  external_ids?: TmdbExternalIds;
  release_dates?: TmdbReleaseDates;

  /** Clave normalizada */
  watchProviders?: TmdbWatchProviders;
}

/* =========================================
  Helper para normalizar la respuesta
========================================= */
export const normalizeMovieBundle = (raw: TmdbMovieBundleRaw): TmdbMovieBundle => {
  const { ['watch/providers']: wp, ...rest } = raw as any;
  return {
    ...(rest as TmdbMovieDetails &
      Omit<
        TmdbMovieBundleRaw,
        'watch/providers' | keyof TmdbMovieDetails
      >),
    watchProviders: wp,
  };
};

/** Estructuras mínimas para /movie/{id}/release_dates */
export interface TmdbReleaseDateItem {
  certification: string;
  iso_639_1: string | null;
  release_date: string; // ISO "YYYY-MM-DDTHH:mm:ss.sssZ"
  type: number; // 1=Premiere, 3=Theatrical, etc.
  note?: string | null;
}
export interface TmdbReleaseDatesForCountry {
  iso_3166_1: string; // "US", "ES", ...
  release_dates: TmdbReleaseDateItem[];
}
export interface TmdbReleaseDates {
  id?: number;
  results: TmdbReleaseDatesForCountry[];
}
