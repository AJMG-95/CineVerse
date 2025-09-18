import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.prod';
import type { TmdbTvDetails } from '@series/interfaces/tmdb-tv-details.interface';
import type { TmdbTv } from '@series/interfaces/TmdbTv.interface';
import { TmdbContentRatings, TmdbTvBundle, TmdbTvImages } from '@series/interfaces/tv-bundle.interface';
import { TmdbExternalIds, TmdbReview } from '@shared/interfaces/common-media.interface';
import { TmdbCredits } from '@shared/interfaces/credits.interface';
import { TmdbVideo, TmdbVideos } from '@shared/interfaces/videos.interface';
import { TmdbWatchProviders } from '@shared/interfaces/watch-providers.interface';
import { forkJoin, Observable, shareReplay, tap } from 'rxjs';
import { TmdbPaged } from '../../shared/interfaces/paged.interface';

@Injectable({
  providedIn: 'root'
})
export class TmbApiTvService {

  private http = inject(HttpClient);
  private base = environment.apiBase;

  // TTL (tiempo de vida) del caché
  private readonly LIST_TTL = 5 * 60 * 1000; // 5 min para listados
  private readonly DETAIL_TTL = 60 * 60 * 1000; // 60 min para detalles/créditos

  private discoverCache = new Map<string, Observable<TmdbPaged<TmdbTv>>>();
  private popularCache = new Map<string, Observable<TmdbPaged<TmdbTv>>>();
  private topRatedCache = new Map<string, Observable<TmdbPaged<TmdbTv>>>();
  private onAirCache = new Map<string, Observable<TmdbPaged<TmdbTv>>>();
  private airingTodayCache = new Map<string, Observable<TmdbPaged<TmdbTv>>>();
  private searchCache = new Map<string, Observable<TmdbPaged<TmdbTv>>>();
  private similarCache = new Map<string, Observable<TmdbPaged<TmdbTv>>>();

  private detailsCache = new Map<string, Observable<TmdbTvDetails>>();
  private aggregateCreditsCache = new Map<string, Observable<TmdbCredits>>();
  private imagesCache = new Map<string, Observable<TmdbTvImages>>();
  private videosCache = new Map<string, Observable<TmdbVideos>>();
  private recommendationsCache = new Map<string, Observable<TmdbPaged<TmdbTv>>>();
  private reviewsCache = new Map<string, Observable<TmdbPaged<TmdbReview>>>();
  private externalIdsCache = new Map<string, Observable<TmdbExternalIds>>();
  private contentRatingsCache = new Map<string, Observable<TmdbContentRatings>>();
  private watchProvidersCache = new Map<string, Observable<TmdbWatchProviders>>();


  discoverTv(opts: {
    genreIds?: number[];
    page?: number;
    languaje?: string;
    match?: 'AND' | 'OR';
    sortBy?: string;
    includeAdult?: boolean;
    firstAirDateGte?: string;
    firstAirDateLte?: string;
    withStatus?: string;
    withWatchMonetizationTypes?: string;
  }): Observable<TmdbPaged<TmdbTv>> {
    const {
      genreIds = [],
      page = 1,
      languaje = 'es-ES',
      match = 'OR',
      sortBy = 'popularity.desc',
      includeAdult = false,
      firstAirDateGte,
      firstAirDateLte,
      withStatus,
      withWatchMonetizationTypes,
    } = opts;

    const sep = match === 'AND' ? ',' : '|';
    const withGenres = genreIds.length ? genreIds.slice().sort((a, b) => a - b).join(sep) : '';

    const key = [
      'discoverTv',
      withGenres, page, languaje, match, sortBy, includeAdult, firstAirDateGte ?? '',
      firstAirDateLte ?? '', withStatus ?? '', withWatchMonetizationTypes ?? ''
    ].join('|');

    const cached = this.discoverCache.get(key);
    if (cached) return cached;

    let params = new HttpParams()
      .set('page', page)
      .set('languaje', languaje)
      .set('sortBy', sortBy)
      .set('includeAdult', includeAdult)

    if (withGenres) params = params.set('withGenres', withGenres);
    if (firstAirDateGte) params = params.set('firstAirDateGte', firstAirDateGte);
    if (firstAirDateLte) params = params.set('firstAirDateLte', firstAirDateLte);
    if (withStatus) params = params.set('withStatus', withStatus);
    if (withWatchMonetizationTypes) params = params.set('withWatchMonetizationTypes', withWatchMonetizationTypes);

    const req$ = this.http
      .get<TmdbPaged<TmdbTv>>(`${this.base}/discover/tv`, { params })
      .pipe(tap({ error: () => this.detailsCache.delete(key) }), shareReplay(1));

    this.discoverCache.set(key, req$);
    setTimeout(() => this.detailsCache.delete(key), this.LIST_TTL);
    return req$;
  }


  popular(page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbTv>> {
    const key = `${page}|${language}`
    const cached = this.popularCache.get(key);
    if (cached) return cached;

    const params = new HttpParams()
      .set('page', page)
      .set('language', language);

    const req$ = this.http
      .get<TmdbPaged<TmdbTv>>(`${this.base}/tv/popular`, { params })
      .pipe(tap({ error: () => this.popularCache.delete(key) }), shareReplay(1));

    this.popularCache.set(key, req$);
    setTimeout(() => this.popularCache.delete(key), this.LIST_TTL);
    return req$;
  }

  topRated(page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbTv>> {
    const key = `${page}|${language}`
    const cached = this.topRatedCache.get(key);
    if (cached) return cached;

    const params = new HttpParams()
      .set('page', page)
      .set('language', language);

    const req$ = this.http
      .get<TmdbPaged<TmdbTv>>(`${this.base}/tv/top_rated`, { params })
      .pipe(tap({ error: () => this.topRatedCache.delete(key) }), shareReplay(1));

    this.topRatedCache.set(key, req$);
    setTimeout(() => this.topRatedCache.delete(key), this.LIST_TTL);
    return req$;
  }

  onTheAir(page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbTv>> {
    const key = `${page}|${language}`
    const cached = this.onAirCache.get(key);
    if (cached) return cached;

    const params = new HttpParams()
      .set('page', page)
      .set('language', language);

    const req$ = this.http
      .get<TmdbPaged<TmdbTv>>(`${this.base}/tv/on_the_air`, { params })
      .pipe(tap({ error: () => this.onAirCache.delete(key) }), shareReplay(1));

    this.onAirCache.set(key, req$);
    setTimeout(() => this.onAirCache.delete(key), this.LIST_TTL);
    return req$;
  }

  airingToday(page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbTv>> {
    const key = `${page}|${language}`;
    const cached = this.airingTodayCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('language', language).set('page', page);
    const req$ = this.http
      .get<TmdbPaged<TmdbTv>>(`${this.base}/tv/airing_today`, { params })
      .pipe(tap({ error: () => this.airingTodayCache.delete(key) }), shareReplay(1));

    this.airingTodayCache.set(key, req$);
    setTimeout(() => this.airingTodayCache.delete(key), this.LIST_TTL);
    return req$;
  }

  search(query: string, page = 1, language = 'es-ES', includeAdult = false): Observable<TmdbPaged<TmdbTv>> {
    const normQ = query.trim().toLowerCase();
    const key = `${normQ}|${page}|${language}|${includeAdult}`;
    const cached = this.searchCache.get(key);
    if (cached) return cached;

    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('language', language)
      .set('include_adult', String(includeAdult));

    const req$ = this.http
      .get<TmdbPaged<TmdbTv>>(`${this.base}/search/tv`, { params })
      .pipe(tap({ error: () => this.searchCache.delete(key) }), shareReplay(1));

    this.searchCache.set(key, req$);
    setTimeout(() => this.searchCache.delete(key), this.LIST_TTL);
    return req$;
  }

  similar(id: number, page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbTv>> {
    const key = `${id}|${page}|${language}`;
    const cached = this.similarCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('page', page).set('language', language);
    const req$ = this.http
      .get<TmdbPaged<TmdbTv>>(`${this.base}/tv/${id}/similar`, { params })
      .pipe(tap({ error: () => this.similarCache.delete(key) }), shareReplay(1));

    this.similarCache.set(key, req$);
    setTimeout(() => this.similarCache.delete(key), this.LIST_TTL);
    return req$;
  }

  details(id: number, language = 'es-ES'): Observable<TmdbTvDetails> {
    const key = `${id}|${language}`;
    const cached = this.detailsCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('language', language);
    const req$ = this.http
      .get<TmdbTvDetails>(`${this.base}/tv/${id}`, { params })
      .pipe(tap({ error: () => this.detailsCache.delete(key) }), shareReplay(1));

    this.detailsCache.set(key, req$);
    setTimeout(() => this.detailsCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  aggregateCredits(id: number, language = 'es-ES'): Observable<TmdbCredits> {
    const key = `${id}|${language}`;
    const cached = this.aggregateCreditsCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('language', language);
    const req$ = this.http
      .get<TmdbCredits>(`${this.base}/tv/${id}/aggregate_credits`, { params })
      .pipe(tap({ error: () => this.aggregateCreditsCache.delete(key) }), shareReplay(1));

    this.aggregateCreditsCache.set(key, req$);
    setTimeout(() => this.aggregateCreditsCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  images(id: number, includeImageLanguage = 'es,en,null'): Observable<TmdbTvImages> {
    const key = `${id}|${includeImageLanguage}`;
    const cached = this.imagesCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('include_image_language', includeImageLanguage);
    const req$ = this.http
      .get<TmdbTvImages>(`${this.base}/tv/${id}/images`, { params })
      .pipe(tap({ error: () => this.imagesCache.delete(key) }), shareReplay(1));

    this.imagesCache.set(key, req$);
    setTimeout(() => this.imagesCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  videos(id: number, language = 'es-ES'): Observable<TmdbVideos> {
    const key = `${id}|${language}`;
    const cached = this.videosCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('language', language);
    const req$ = this.http
      .get<TmdbVideos>(`${this.base}/tv/${id}/videos`, { params })
      .pipe(tap({ error: () => this.videosCache.delete(key) }), shareReplay(1));

    this.videosCache.set(key, req$);
    setTimeout(() => this.videosCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  recommendations(id: number, page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbTv>> {
    const key = `${id}|${page}|${language}`;
    const cached = this.recommendationsCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('page', page).set('language', language);
    const req$ = this.http
      .get<TmdbPaged<TmdbTv>>(`${this.base}/tv/${id}/recommendations`, { params })
      .pipe(tap({ error: () => this.recommendationsCache.delete(key) }), shareReplay(1));

    this.recommendationsCache.set(key, req$);
    setTimeout(() => this.recommendationsCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  reviews(id: number, page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbReview>> {
    const key = `${id}|${page}|${language}`;
    const cached = this.reviewsCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('page', page).set('language', language);
    const req$ = this.http
      .get<TmdbPaged<TmdbReview>>(`${this.base}/tv/${id}/reviews`, { params })
      .pipe(tap({ error: () => this.reviewsCache.delete(key) }), shareReplay(1));

    this.reviewsCache.set(key, req$);
    setTimeout(() => this.reviewsCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  externalIds(id: number): Observable<TmdbExternalIds> {
    const key = `${id}`;
    const cached = this.externalIdsCache.get(key);
    if (cached) return cached;

    const req$ = this.http
      .get<TmdbExternalIds>(`${this.base}/tv/${id}/external_ids`)
      .pipe(tap({ error: () => this.externalIdsCache.delete(key) }), shareReplay(1));

    this.externalIdsCache.set(key, req$);
    setTimeout(() => this.externalIdsCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  contentRatings(id: number): Observable<TmdbContentRatings> {
    const key = `${id}`;
    const cached = this.contentRatingsCache.get(key);
    if (cached) return cached;

    const req$ = this.http
      .get<TmdbContentRatings>(`${this.base}/tv/${id}/content_ratings`)
      .pipe(tap({ error: () => this.contentRatingsCache.delete(key) }), shareReplay(1));

    this.contentRatingsCache.set(key, req$);
    setTimeout(() => this.contentRatingsCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  watchProviders(id: number): Observable<TmdbWatchProviders> {
    const key = `${id}`;
    const cached = this.watchProvidersCache.get(key);
    if (cached) return cached;

    const req$ = this.http
      .get<TmdbWatchProviders>(`${this.base}/tv/${id}/watch/providers`)
      .pipe(tap({ error: () => this.watchProvidersCache.delete(key) }), shareReplay(1));

    this.watchProvidersCache.set(key, req$);
    setTimeout(() => this.watchProvidersCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  /** Helper opcional: carga todo en paralelo SIN heredar tipos  */
  loadAll(id: number, language = 'es-ES', includeImageLanguage = 'es,en,null') {
    return forkJoin({
      details: this.details(id, language),
      aggregateCredits: this.aggregateCredits(id, language),
      images: this.images(id, includeImageLanguage),
      videos: this.videos(id, language),
      recommendations: this.recommendations(id, 1, language),
      similar: this.similar(id, 1, language),
      reviews: this.reviews(id, 1, language),
      externalIds: this.externalIds(id),
      contentRatings: this.contentRatings(id),
      watchProviders: this.watchProviders(id),
    });
  }

  clearCache(): void {
    this.discoverCache.clear();
    this.popularCache.clear();
    this.topRatedCache.clear();
    this.onAirCache.clear();
    this.airingTodayCache.clear();
    this.searchCache.clear();
    this.similarCache.clear();

    this.detailsCache.clear();
    this.aggregateCreditsCache.clear();
    this.imagesCache.clear();
    this.videosCache.clear();
    this.recommendationsCache.clear();
    this.reviewsCache.clear();
    this.externalIdsCache.clear();
    this.contentRatingsCache.clear();
    this.watchProvidersCache.clear();
  }

}
