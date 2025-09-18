//? CineVerse\src\app\shared\interfaces\paged.interface.ts

export interface TmdbPaged<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
