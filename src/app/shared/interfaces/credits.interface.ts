//? CineVerse\src\app\shared\interfaces\credits.interface.ts

/**
 * Género que devuelve TMDB:
 * 0 = desconocido, 1 = mujer, 2 = hombre, 3 = no binario
 */
export type TmdbGender = 0 | 1 | 2 | 3;

/**
 * Campos base comunes a cualquier persona en los créditos (cast/crew)
 */
export interface TmdbPersonBase {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null; // ruta del avatar en TMDB
  adult: boolean;
  popularity: number;
  gender: TmdbGender | null;
  known_for_department: string; // p. ej. "Acting", "Directing"
}

/**
 * Item del REPARTO (CAST).
 */
export interface TmdbCastMember extends TmdbPersonBase {
  credit_id: string;
  cast_id?: number;           // suele venir en películas
  character?: string;         // nombre del personaje principal
  order?: number;             // orden de aparición en créditos (películas)
  episode_count?: number;     // para TV (a veces total_episode_count)
  total_episode_count?: number;
  roles?: Array<{
    credit_id: string;
    character: string;
    episode_count: number;
  }>;
}

/**
 * Item del EQUIPO TÉCNICO (CREW).
 */
export interface TmdbCrewMember extends TmdbPersonBase {
  credit_id: string;
  department: string; //departamento (Directing, Writing, etc.)
  job: string; // rol concreto (Director, Writer, etc.)
}

/**
 * Contenedor de créditos que TMDB devuelve en:
 * - /movie/{id}/credits
 * - /tv/{id}/credits
 * - /tv/{id}/season/{season_number}/credits
 * - /tv/{id}/season/{s}/episode/{e}/credits
 */
export interface TmdbCredits {
  id: number;                // id del recurso (película/serie/temporada/episodio)
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

/** Alias por contexto/endpoint*/
export type TmdbMovieCredits = TmdbCredits;
export type TmdbTvCredits = TmdbCredits;
export type TmdbSeasonCredits = TmdbCredits;
export type TmdbEpisodeCredits = TmdbCredits;
