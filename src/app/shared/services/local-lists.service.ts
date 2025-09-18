import { Injectable, signal, WritableSignal } from '@angular/core';
import { TmdbMovie } from '../../movies/interfaces/movie.interface';
import { TmdbTv } from '../../series/interfaces/TmdbTv.interface';
import { TmdbMovieBundle } from '@movies/interfaces/movie-bundle.interfaces';

export type MovieListKey = 'movie:favorites' | 'movie:list' | 'movie:watched';
export type TvListKey = 'tv:favorites' | 'tv:list' | 'tv:watched';
export type ListKey = MovieListKey | TvListKey;

/** Cualquier item con id numérico */
export interface HasId {
  id: number;
}

const PREFIX = 'cv:list:'; // namespacing para evitar colisiones entre claves del local storage

/** Error controlado cuando la cuota está llena */
export class StorageQuotaExceededError extends Error {
  constructor(public key: ListKey, public media: 'movie' | 'tv', public currentCount: number) {
    super(`Cuota llena para la lista ${key}.`);
    this.name = 'StorageQuotaExceededError';
  }
}

@Injectable({ providedIn: 'root' })
export class LocalListsService {
  /** caché reactiva por lista */
  private stores = new Map<ListKey, WritableSignal<HasId[]>>();

  constructor() {
    // Sync multi-tab: si otro tab toca el mismo storage, refrescamos la signal
    window.addEventListener('storage', (e) => {
      if (!e.key?.startsWith(PREFIX)) return;
      const key = e.key.replace(PREFIX, '') as ListKey;
      const store = this.stores.get(key);
      if (store) store.set(this.readFromStorage(key));
    });
  }

  //* --------------- API principal (genérica) ---------------

  /** Devuelve la signal reactiva de la lista (para plantillas con signals) */
  listSignal<T extends HasId = HasId>(key: ListKey): WritableSignal<T[]> {
    let s = this.stores.get(key);
    if (!s) {
      s = signal<T[]>(this.readFromStorage<T>(key));
      this.stores.set(key, s as unknown as WritableSignal<HasId[]>);
    }
    return s as WritableSignal<T[]>;
  }

  /** Snapshot actual (array) */
  getAll<T extends HasId = HasId>(key: ListKey): T[] {
    return this.listSignal<T>(key)();
  }

  /** Añade al principio (evita duplicados por id). Devuelve true si añadió. */
  add<T extends HasId>(key: ListKey, item: T): boolean {
    const s = this.listSignal<T>(key);
    if (this.has(key, item.id)) return false;

    const prev = s();
    const next = [...prev, item]; // nuevo al final

    // persistimos primero; si falla, lanzamos error y NO tocamos la signal
    this.persist(key, next);
    s.set(next);
    return true;
  }

  /** Quita por id. Devuelve true si quitó algo. */
  remove(key: ListKey, id: number): boolean {
    const s = this.listSignal(key);
    const prev = s();
    const next = prev.filter((it) => it.id !== id);
    if (next.length === prev.length) return false;
    this.persist(key, next);
    s.set(next);
    return true;
  }

  /** Alterna: si existe lo quita, si no existe lo añade. Devuelve estado final (true = está dentro). */
  toggle<T extends HasId>(key: ListKey, item: T): boolean {
    return this.has(key, item.id)
      ? (this.remove(key, item.id), false)
      : (this.add(key, item), true);
  }

  /** Existe por id */
  has(key: ListKey, id: number): boolean {
    return this.listSignal(key)().some((it) => it.id === id);
  }

  /** Limpia toda la lista */
  clear(key: ListKey): void {
    this.persist(key, []);
    this.listSignal(key).set([]);
  }

  //* --------------- Atajos por comodidad (opcional) ---------------

  //? Peliculas  //
  /*   addMovieToFavorites<T extends HasId>(item: T) { return this.add('movie:favorites', item); } */
  addMovieToFavorites(item: TmdbMovie | TmdbMovieBundle) {
    return this.add('movie:favorites', item);
  }
  /*   removeMovieFromFavorites(id: number) { return this.remove('movie:favorites', id); } */
  removeMovieFromFavorites(id: number) {
    return this.remove('movie:favorites', id);
  }

  /*   movieFavorites<T extends HasId>() { return this.listSignal<T>('movie:favorites'); } */
  movieFavorites(): WritableSignal<TmdbMovie[]> {
    return this.listSignal<TmdbMovie>('movie:favorites');
  }

  /*   addMovieToList<T extends HasId>(item: T) { return this.add('movie:list', item); } */
  addMovieToList(item: TmdbMovie | TmdbMovieBundle) {
    return this.add('movie:list', item);
  }
  /*   removeMovieFromList(id: number) { return this.remove('movie:list', id); } */
  removeMovieFromList(id: number) {
    return this.remove('movie:list', id);
  }
  /*   movieList<T extends HasId>() { return this.listSignal<T>('movie:list'); } */
  movieList(): WritableSignal<TmdbMovie[]> {
    return this.listSignal<TmdbMovie>('movie:list');
  }

  /*   addMovieToWatched<T extends HasId>(item: T) { return this.add('movie:watched', item); } */
  addMovieToWatched(item: TmdbMovie | TmdbMovieBundle) {
    return this.add('movie:watched', item);
  }
  /*   removeMovieFromWatched(id: number) { return this.remove('movie:watched', id); } */
  removeMovieFromWatched(id: number) {
    return this.remove('movie:watched', id);
  }
  /*   movieWatched<T extends HasId>() { return this.listSignal<T>('movie:watched'); } */
  movieWatched(): WritableSignal<TmdbMovie[]> {
    return this.listSignal<TmdbMovie>('movie:watched');
  }

  //? Series //
  /*   addTvToFavorites<T extends HasId>(item: T) { return this.add('tv:favorites', item); } */
  addTvToFavorites(item: TmdbTv) {
    return this.add('tv:favorites', item);
  }
  /*   removeTvFromFavorites(id: number) { return this.remove('tv:favorites', id); } */
  removeTvFromFavorites(id: number) {
    return this.remove('tv:favorites', id);
  }
  /*   tvFavorites<T extends HasId>() { return this.listSignal<T>('tv:favorites'); } */
  tvFavorites(): WritableSignal<TmdbTv[]> {
    return this.listSignal<TmdbTv>('tv:favorites');
  }

  /*   addTvToList<T extends HasId>(item: T) { return this.add('tv:list', item); } */
  addTvToList(item: TmdbTv) {
    return this.add('tv:list', item);
  }
  /*   removeTvFromList(id: number) { return this.remove('tv:list', id); } */
  removeTvFromList(id: number) {
    return this.remove('tv:list', id);
  }
  /*   tvList<T extends HasId>() { return this.listSignal<T>('tv:list'); } */
  tvList(): WritableSignal<TmdbTv[]> {
    return this.listSignal<TmdbTv>('tv:list');
  }

  /*   addTvToWatched<T extends HasId>(item: T) { return this.add('tv:watched', item); } */
  addTvToWatched(item: TmdbTv) {
    return this.add('tv:watched', item);
  }
  /*   removeTvFromWatched(id: number) { return this.remove('tv:watched', id); } */
  removeTvFromWatched(id: number) {
    return this.remove('tv:watched', id);
  }
  /*   tvWatched<T extends HasId>() { return this.listSignal<T>('tv:watched'); } */
  tvWatched(): WritableSignal<TmdbTv[]> {
    return this.listSignal<TmdbTv>('tv:watched');
  }

  //* ---------- Atajos "has" (¿está en la lista?) ----------

  //? Películas //
  isMovieInFavorites(id: number): boolean {
    return this.has('movie:favorites', id);
  }
  isMovieInList(id: number): boolean {
    return this.has('movie:list', id);
  }
  isMovieInWatched(id: number): boolean {
    return this.has('movie:watched', id);
  }

  //? Series //
  isTvInFavorites(id: number): boolean {
    return this.has('tv:favorites', id);
  }
  isTvInList(id: number): boolean {
    return this.has('tv:list', id);
  }
  isTvInWatched(id: number): boolean {
    return this.has('tv:watched', id);
  }

  //* --------------- Helpers de persistencia ---------------

  private storageKey(key: ListKey) {
    return `${PREFIX}${key}`;
  }

  private readFromStorage<T extends HasId = HasId>(key: ListKey): T[] {
    try {
      const raw = localStorage.getItem(this.storageKey(key));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      // Sanitiza: solo arrays con objetos que tengan id numérico
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((x: any) => x && typeof x.id === 'number') as T[];
    } catch {
      return [];
    }
  }

  /** Intenta guardar. Si la cuota está llena, lanza StorageQuotaExceededError con detalles. */
  private persist(key: ListKey, data: HasId[]) {
    try {
      localStorage.setItem(this.storageKey(key), JSON.stringify(data));
    } catch (err: any) {
      if (this.isQuotaError(err)) {
        const media: 'movie' | 'tv' = key.startsWith('movie') ? 'movie' : 'tv';
        const count = data.length;
        throw new StorageQuotaExceededError(key, media, count);
      }
      throw err;
    }
  }

  /** Heurística multi-navegador para detectar error de cuota */
  private isQuotaError(e: any): boolean {
    return (
      e?.name === 'QuotaExceededError' ||
      e?.name === 'NS_ERROR_DOM_QUOTA_REACHED' || // Firefox
      e?.code === 22 ||
      e?.code === 1014
    );
  }

  hasIn(media: 'movie' | 'tv', bucket: 'favorites' | 'list' | 'watched', id: number): boolean {
    return this.has(`${media}:${bucket}` as ListKey, id);
  }


  //* ---------- Acción forzada: eliminar el más antiguo y añadir el nuevo ----------
  /**
   * Elimina el elemento más antiguo (index 0) y añade 'item' al final, luego persiste y actualiza la signal.
   * Úsalo cuando el usuario ACEPTE reemplazar el más antiguo tras el error de cuota.
   */
  forceAddDroppingOldest<T extends HasId>(key: ListKey, item: T): boolean {
    const s = this.listSignal<T>(key);
    const prev = s();
    // Si ya existe, no hace falta nada.
    if (prev.some((x) => x.id === item.id)) return true;

    // Quitamos el más antiguo (index 0) y añadimos el nuevo al final
    const withoutOldest = prev.slice(1);
    const next = [...withoutOldest, item];

    this.persist(key, next); // si sigue fallando, vuelve a lanzar error
    s.set(next);
    return true;
  }
}
