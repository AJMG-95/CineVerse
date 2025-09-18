import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

import { normalizeMovieBundle, TmdbMovieBundle, TmdbMovieBundleRaw } from '@movies/interfaces/movie-bundle.interfaces';
import { TmdbPaged } from '../../shared/interfaces/paged.interface';
import { TmdbMovieDetails } from '../interfaces/movie-details.interface';
import type { TmdbMovie } from '../interfaces/movie.interface';

@Injectable({ providedIn: 'root' })
export class TmdbApiMovieService {
  private http = inject(HttpClient);
  private base = environment.apiBase;

  // TTL (tiempo de vida) del caché
  private readonly LIST_TTL = 5 * 60 * 1000; // 5 min para listados
  private readonly DETAIL_TTL = 60 * 60 * 1000; // 60 min para detalles/créditos

  // Un Map por endpoint. Guardamos: key -> Observable compartido (shareReplay)
  private popularCache = new Map<string, Observable<TmdbPaged<TmdbMovie>>>();
  private topRatedCache = new Map<string, Observable<TmdbPaged<TmdbMovie>>>();
  private upcomingCache = new Map<string, Observable<TmdbPaged<TmdbMovie>>>();
  private nowPlayingCache = new Map<string, Observable<TmdbPaged<TmdbMovie>>>();
  private searchCache = new Map<string, Observable<TmdbPaged<TmdbMovie>>>();
  private similarCache = new Map<string, Observable<TmdbPaged<TmdbMovie>>>();
  private discoverCache = new Map<string, Observable<TmdbPaged<TmdbMovie>>>();
  private detailsBundleCache = new Map<string, Observable<TmdbMovieBundle>>();

  private detailsCache = new Map<string, Observable<TmdbMovieDetails>>();
  private creditsCache = new Map<string, Observable<any>>();

  // añade estos campos a la firma
  discoverMovies(opts: {
    genreIds?: number[];
    page?: number;
    language?: string;
    match?: 'AND' | 'OR';
    sortBy?: string;
    includeAdult?: boolean;
    year?: number;
    minVoteCount?: number;

    // existentes para upcoming
    primaryReleaseDateGte?: string;
    primaryReleaseDateLte?: string;

    // ✅ nuevos para emular now_playing
    releaseDateGte?: string;
    releaseDateLte?: string;
    withReleaseType?: string; // '2|3'

    region?: string;
  }): Observable<TmdbPaged<TmdbMovie>> {
    const {
      genreIds = [],
      page = 1,
      language = 'es-ES',
      match = 'OR',
      sortBy = 'popularity.desc',
      includeAdult = false,
      year,
      minVoteCount,
      primaryReleaseDateGte,
      primaryReleaseDateLte,
      // nuevos
      releaseDateGte,
      releaseDateLte,
      withReleaseType,
      region,
    } = opts;

    const sep = match === 'AND' ? ',' : '|';
    const withGenres = genreIds.length
      ? genreIds.slice().sort((a, b) => a - b).join(sep)
      : '';

    const key = [
      'discover',
      withGenres,
      page,
      language,
      match,
      sortBy,
      includeAdult,
      year ?? '',
      minVoteCount ?? '',
      primaryReleaseDateGte ?? '',
      primaryReleaseDateLte ?? '',
      // nuevos en el key
      releaseDateGte ?? '',
      releaseDateLte ?? '',
      withReleaseType ?? '',
      region ?? '',
    ].join('|');

    const cached = this.discoverCache.get(key);
    if (cached) return cached;

    let params = new HttpParams()
      .set('page', page)
      .set('language', language)
      .set('sort_by', sortBy)
      .set('include_adult', String(includeAdult));

    if (withGenres) params = params.set('with_genres', withGenres);
    if (year) params = params.set('year', String(year));
    if (minVoteCount) params = params.set('vote_count.gte', String(minVoteCount));

    // existentes (upcoming)
    if (primaryReleaseDateGte) params = params.set('primary_release_date.gte', primaryReleaseDateGte);
    if (primaryReleaseDateLte) params = params.set('primary_release_date.lte', primaryReleaseDateLte);

    // ✅ nuevos (now_playing)
    if (releaseDateGte) params = params.set('release_date.gte', releaseDateGte);
    if (releaseDateLte) params = params.set('release_date.lte', releaseDateLte);
    if (withReleaseType) params = params.set('with_release_type', withReleaseType);

    if (region) params = params.set('region', region);

    const req$ = this.http
      .get<TmdbPaged<TmdbMovie>>(`${this.base}/discover/movie`, { params })
      .pipe(tap({ error: () => this.discoverCache.delete(key) }), shareReplay(1));

    this.discoverCache.set(key, req$);
    setTimeout(() => this.discoverCache.delete(key), this.LIST_TTL);
    return req$;
  }


  /* Peliculas populares */
  popular(
    page = 1,
    language = 'es-ES',
    genreIds: number[] = [],
    match: 'AND' | 'OR' = 'OR'
  ): Observable<TmdbPaged<TmdbMovie>> {
    // si nos piden géneros, usamos discover emulando "populares"
    if (genreIds.length > 0) {
      return this.discoverMovies({
        genreIds: genreIds,
        page: page,
        language: language,
        match: match,
        sortBy: 'popularity.desc',
      });
    }

    const key = `${page}|${language}`;
    const cached = this.popularCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('page', page).set('language', language);
    const req$ = this.http.get<TmdbPaged<TmdbMovie>>(`${this.base}/movie/popular`, { params }).pipe(
      tap({ error: () => this.popularCache.delete(key) }), // si falla, deja libre para reintentar
      shareReplay(1)
    );

    this.popularCache.set(key, req$);
    setTimeout(() => this.popularCache.delete(key), this.LIST_TTL); // caduca
    return req$;
  }

  /* Películas más votadas */
  topRated(
    page = 1,
    language = 'es-ES',
    genreIds: number[] = [],
    match: 'AND' | 'OR' = 'OR',
    minVotes = 200
  ): Observable<TmdbPaged<TmdbMovie>> {
    if (genreIds.length > 0) {
      return this.discoverMovies({
        genreIds, page, language, match,
        sortBy: 'vote_average.desc',
        minVoteCount: minVotes,
      });
    }

    // rama original con caché propio
    const key = `${page}|${language}`;
    const cached = this.topRatedCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('page', page).set('language', language);
    const req$ = this.http
      .get<TmdbPaged<TmdbMovie>>(`${this.base}/movie/top_rated`, { params })
      .pipe(tap({ error: () => this.topRatedCache.delete(key) }), shareReplay(1));

    this.topRatedCache.set(key, req$);
    setTimeout(() => this.topRatedCache.delete(key), this.LIST_TTL);
    return req$;
  }

  /* Proximos estrenos */
  upcoming(
    page = 1,
    language = 'es-ES',
    genreIds: number[] = [],
    match: 'AND' | 'OR' = 'OR',
    region: string = 'ES'
  ): Observable<TmdbPaged<TmdbMovie>> {
    if (genreIds.length > 0) {
      const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
      return this.discoverMovies({
        genreIds, page, language, match,
        sortBy: 'primary_release_date.asc',
        primaryReleaseDateGte: today,
        region,
      });
    }

    // rama original con caché propio
    const key = `${page}|${language}`;
    const cached = this.upcomingCache.get(key);
    if (cached) return cached;

    const params = new HttpParams()
      .set('page', page)
      .set('language', language)
      .set('region', region);

    const req$ = this.http
      .get<TmdbPaged<TmdbMovie>>(`${this.base}/movie/upcoming`, { params })
      .pipe(tap({ error: () => this.upcomingCache.delete(key) }), shareReplay(1));

    this.upcomingCache.set(key, req$);
    setTimeout(() => this.upcomingCache.delete(key), this.LIST_TTL);
    return req$;
  }

  nowPlaying(
    page = 1,
    language = 'es-ES',
    genreIds: number[] = [],
    match: 'AND' | 'OR' = 'OR',
    region = 'ES'
  ): Observable<TmdbPaged<TmdbMovie>> {
    // util para fecha local → YYYY-MM-DD (sin desfase UTC)
    const toLocalISODate = (d: Date) => {
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    if (genreIds.length > 0) {
      // ventana aproximada "en cines": últimos 30 días hasta hoy
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - 30);

      return this.discoverMovies({
        genreIds,
        page,
        language,
        match,
        sortBy: 'release_date.desc',
        releaseDateGte: toLocalISODate(start),
        releaseDateLte: toLocalISODate(today),
        withReleaseType: '2|3',
        region,
      });
    }

    // Rama directa al endpoint oficial
    const key = `${page}|${language}|${region}`;
    const cached = this.nowPlayingCache.get(key);
    if (cached) return cached;

    const params = new HttpParams()
      .set('page', page)
      .set('language', language)
      .set('region', region);

    const req$ = this.http
      .get<TmdbPaged<TmdbMovie>>(`${this.base}/movie/now_playing`, { params })
      .pipe(
        tap({ error: () => this.nowPlayingCache.delete(key) }),
        shareReplay(1)
      );

    this.nowPlayingCache.set(key, req$);
    setTimeout(() => this.nowPlayingCache.delete(key), this.LIST_TTL);
    return req$;
  }





  /* Para busar por nombre */
  search(
    query: string,
    page = 1,
    language = 'es-ES',
    includeAdult = false,
    year?: number,
    primaryReleaseYear?: number
  ): Observable<TmdbPaged<TmdbMovie>> {
    const normQ = query.trim().toLowerCase();
    const key = `${normQ}|${page}|${language}|${includeAdult}|${year ?? ''}|${
      primaryReleaseYear ?? ''
    }`;
    const cached = this.searchCache.get(key);
    if (cached) return cached;

    let params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('language', language)
      .set('include_adult', String(includeAdult));

    if (year) params = params.set('year', String(year));
    if (primaryReleaseYear) params = params.set('primary_release_year', String(primaryReleaseYear));

    const req$ = this.http
      .get<TmdbPaged<TmdbMovie>>(`${this.base}/search/movie`, { params })
      .pipe(tap({ error: () => this.searchCache.delete(key) }), shareReplay(1));

    this.searchCache.set(key, req$);
    setTimeout(() => this.searchCache.delete(key), this.LIST_TTL);
    return req$;
  }

  similar(id: number, page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbMovie>> {
    const key = `${id}|${page}|${language}`;
    const cached = this.similarCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('page', page).set('language', language);
    const req$ = this.http
      .get<TmdbPaged<TmdbMovie>>(`${this.base}/movie/${id}/similar`, { params })
      .pipe(tap({ error: () => this.similarCache.delete(key) }), shareReplay(1));

    this.similarCache.set(key, req$);
    setTimeout(() => this.similarCache.delete(key), this.LIST_TTL);
    return req$;
  }

  details(id: number, language = 'es-ES'): Observable<TmdbMovieDetails> {
    const key = `${id}|${language}`;
    const cached = this.detailsCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('language', language);
    const req$ = this.http
      .get<TmdbMovieDetails>(`${this.base}/movie/${id}`, { params })
      .pipe(tap({ error: () => this.detailsCache.delete(key) }), shareReplay(1));

    this.detailsCache.set(key, req$);
    setTimeout(() => this.detailsCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  credits(id: number, language = 'es-ES'): Observable<any> {
    const key = `${id}|${language}`;
    const cached = this.creditsCache.get(key);
    if (cached) return cached;

    const params = new HttpParams().set('language', language);
    const req$ = this.http
      .get<any>(`${this.base}/movie/${id}/credits`, { params })
      .pipe(tap({ error: () => this.creditsCache.delete(key) }), shareReplay(1));

    this.creditsCache.set(key, req$);
    setTimeout(() => this.creditsCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  /** Trae TODO en una sola petición usando append_to_response */
  getMovieBundle(
    id: number,
    language = 'es-ES',
    imageLangs: string = 'es,en,null'
  ): Observable<TmdbMovieBundle> {
    const key = `bundle|${id}|${language}|${imageLangs}`;
    const cached = this.detailsBundleCache.get(key);
    if (cached) return cached;

    const params = new HttpParams()
      .set('language', language)
      .set(
        'append_to_response',
        // añadimos watch/providers para plataformas
        'credits,images,videos,recommendations,similar,reviews,external_ids,release_dates,watch/providers'
      )
      // para que TMDB incluya posters/backdrops en esos idiomas (+ null)
      .set('include_image_language', imageLangs);

    const req$ = this.http
      // Pedimos el RAW porque la clave viene como 'watch/providers'
      .get<TmdbMovieBundleRaw>(`${this.base}/movie/${id}`, { params })
      // Normalizamos: 'watch/providers' -> watchProviders
      .pipe(
        map(normalizeMovieBundle),
        tap({ error: () => this.detailsBundleCache.delete(key) }),
        shareReplay(1)
      );

    this.detailsBundleCache.set(key, req$);
    setTimeout(() => this.detailsBundleCache.delete(key), this.DETAIL_TTL);
    return req$;
  }

  /** Limpia todo el caché */
  clearCache(): void {
    this.popularCache.clear();
    this.topRatedCache.clear();
    this.upcomingCache.clear();
    this.searchCache.clear();
    this.similarCache.clear();
    this.discoverCache.clear();

    this.detailsCache.clear();
    this.creditsCache.clear();
    this.detailsBundleCache.clear();
  }
}
