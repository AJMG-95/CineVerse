import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import type { TmdbPaged } from '../../shared/interfaces/paged.interface';
import type  { TmdbMovie } from '../interfaces/movie.interface';



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
    const params = new HttpParams().set('query', query).set('page', page).set('language', language);
    return this.http.get<TmdbPaged<TmdbMovie>>(`${this.base}/search/movie`, { params });
  }

}
