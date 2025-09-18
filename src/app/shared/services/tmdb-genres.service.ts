import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

export interface TmdbGenre { id: number; name: string; }
interface TmdbGenresResponse { genres: TmdbGenre[]; }
export type MediaType = 'movie' | 'tv';

@Injectable({ providedIn: 'root' })
export class TmdbGenresService {
  private http = inject(HttpClient);
  private base = environment.apiBase;

  private listCache = new Map<string, Observable<TmdbGenre[]>>();
  private mapCache = new Map<string, Observable<Record<number, string>>>();

  private key(media: MediaType) {
    return `${media}`;
  }

  getAll(media: MediaType = 'movie'): Observable<TmdbGenre[]> {

    const key = this.key(media);

    if (!this.listCache.has(key)) {
      const params = new HttpParams();
      const req$ = this.http
        .get<TmdbGenresResponse>(`${this.base}/genre/${media}/list`, { params })
        .pipe(
          map(res => res.genres ?? []),
          catchError(() => of([])),
          shareReplay({ bufferSize: 1, refCount: false })
        );
      this.listCache.set(key, req$);
    }
    return this.listCache.get(key)!;
  }

  getMap(media: MediaType = 'movie'): Observable<Record<number, string>> {
    const k = this.key(media);
    if (!this.mapCache.has(k)) {
      const map$ = this.getAll(media).pipe(
        map(list => list.reduce((acc, g) => { acc[g.id] = g.name; return acc; }, {} as Record<number, string>)),
        shareReplay({ bufferSize: 1, refCount: false })
      );
      this.mapCache.set(k, map$);
    }
    return this.mapCache.get(k)!;
  }

  getNameById(id: number, media: MediaType = 'movie'):
    Observable<string | undefined> {
    return this.getMap(media).pipe(map(dict => dict[id]));
  }

  clearCache(media?: MediaType) {
    if (!media ) { this.listCache.clear(); this.mapCache.clear(); return; }
    const k = this.key(media ?? 'movie');
    this.listCache.delete(k); this.mapCache.delete(k);
  }

  prefetch(media: MediaType = 'movie') {
    this.getAll(media).subscribe({}); // caliente la caché
  }
}
