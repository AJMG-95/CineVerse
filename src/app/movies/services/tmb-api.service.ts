import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

export interface TmdbPaged<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
}

export interface TmdbGenre { id: number; name: string; }

@Injectable({ providedIn: 'root' })
export class TmdbApiService {
  private http = inject(HttpClient);
  private base = environment.apiBase;

  popular(page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbMovie>> {
    const params = new HttpParams().set('page', page).set('language', language);
    return this.http.get<TmdbPaged<TmdbMovie>>(`${this.base}/movie/popular`, { params });
  }

  topRated(page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbMovie>> {
    const params = new HttpParams().set('page', page).set('language', language);
    return this.http.get<TmdbPaged<TmdbMovie>>(`${this.base}/movie/top_rated`, { params });
  }

  upcoming(page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbMovie>> {
    const params = new HttpParams().set('page', page).set('language', language);
    return this.http.get<TmdbPaged<TmdbMovie>>(`${this.base}/movie/upcoming`, { params });
  }

  details(id: number, language = 'es-ES'): Observable<any> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any>(`${this.base}/movie/${id}`, { params });
  }

  credits(id: number, language = 'es-ES'): Observable<any> {
    const params = new HttpParams().set('language', language);
    return this.http.get<any>(`${this.base}/movie/${id}/credits`, { params });
  }

  similar(id: number, page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbMovie>> {
    const params = new HttpParams().set('page', page).set('language', language);
    return this.http.get<TmdbPaged<TmdbMovie>>(`${this.base}/movie/${id}/similar`, { params });
  }

  search(query: string, page = 1, language = 'es-ES'): Observable<TmdbPaged<TmdbMovie>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('language', language);
    return this.http.get<TmdbPaged<TmdbMovie>>(`${this.base}/search/movie`, { params });
  }

  genres(language = 'es-ES'): Observable<{ genres: TmdbGenre[] }> {
    const params = new HttpParams().set('language', language);
    return this.http.get<{ genres: TmdbGenre[] }>(`${this.base}/genre/movie/list`, { params });
  }
}
