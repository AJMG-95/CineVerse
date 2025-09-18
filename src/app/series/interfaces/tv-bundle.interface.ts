// tv-bundle.interfaces.ts
import {
  TmdbCredits,
  TmdbExternalIds,
  TmdbPaged,
  TmdbReview,
  TmdbVideos,
} from '@shared/interfaces/barrel';
import { TmdbWatchProviders } from '@shared/interfaces/watch-providers.interface';
import { TmdbTvDetails } from './tmdb-tv-details.interface';
import { TmdbTv } from './TmdbTv.interface';

/* ======================================================
   Auxiliares específicos de TV (estructura igual a movie)
====================================================== */
export interface TmdbTvImages {
  backdrops: {
    aspect_ratio: number;
    height: number;
    iso_639_1: string | null;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }[];
  logos: {
    aspect_ratio: number;
    height: number;
    iso_639_1: string | null;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }[];
  posters: {
    aspect_ratio: number;
    height: number;
    iso_639_1: string | null;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }[];
}

/** /tv/{id}/content_ratings */
export interface TmdbContentRatingItem {
  iso_3166_1: string; // "US", "ES", ...
  rating: string;     // "TV-MA", "13", etc.
}
export interface TmdbContentRatings {
  results: TmdbContentRatingItem[];
}

/* =========================================
  1) RAW: coincide con la respuesta de TMDB
  (omitimos campos que redefinimos con tipos compartidos)
========================================= */
export interface TmdbTvBundleRaw
  extends Omit<
    TmdbTvDetails,
    'videos' | 'images' | 'credits' | 'aggregate_credits' | 'external_ids' | 'watchProviders'
  > {
  aggregate_credits?: TmdbCredits;
  credits?: TmdbCredits;

  images: TmdbTvImages;
  videos: TmdbVideos;

  similar: TmdbPaged<TmdbTv>;
  recommendations: TmdbPaged<TmdbTv>;
  reviews: TmdbPaged<TmdbReview>;

  external_ids?: TmdbExternalIds;
  content_ratings?: TmdbContentRatings;

  /** TMDB devuelve esta clave con una barra "/" */
  ['watch/providers']?: TmdbWatchProviders;
}

/* =========================================
  2) NORMALIZADO: clave amigable para la app
========================================= */
export interface TmdbTvBundle
  extends Omit<
    TmdbTvDetails,
    'videos' | 'images' | 'credits' | 'aggregate_credits' | 'external_ids' | 'watchProviders'
  > {
  aggregate_credits?: TmdbCredits;
  credits?: TmdbCredits;

  images: TmdbTvImages;
  videos: TmdbVideos;

  similar: TmdbPaged<TmdbTv>;
  recommendations: TmdbPaged<TmdbTv>;
  reviews: TmdbPaged<TmdbReview>;

  external_ids?: TmdbExternalIds;
  content_ratings?: TmdbContentRatings;

  /** Clave normalizada (sin slash) */
  watchProviders?: TmdbWatchProviders;
}

/* =========================================
  Helper para normalizar la respuesta
========================================= */
export const normalizeTvBundle = (raw: TmdbTvBundleRaw): TmdbTvBundle => {
  const { ['watch/providers']: wp, ...rest } = raw as any;
  return {
    ...(rest as Omit<TmdbTvBundleRaw, 'watch/providers'>),
    watchProviders: wp,
  };
};
