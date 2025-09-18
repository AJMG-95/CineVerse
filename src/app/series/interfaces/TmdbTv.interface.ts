export interface TmdbTv {
  backdrop_path: string | null;
  first_air_date: string | null;        // 'YYYY-MM-DD'
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];             // códigos ISO 3166-1 alpha-2
  original_language: string;            // ISO 639-1
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;                 // suele ser decimal
  vote_count: number;
}
