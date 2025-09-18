//? CineVerse\src\app\shared\interfaces\watch-providers.interface.ts

/** Item de proveedor (Apple TV, Netflix, etc.) */
export interface TmdbWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
}

/** Agrupaciones de proveedores por tipo de monetización en un país */
export interface TmdbWatchProvidersForCountry {
  link: string; // landing en TMDB con todos los proveedores

  // Listas opcionales según disponibilidad en ese país:
  flatrate?: TmdbWatchProvider[];          // suscripción (Netflix, Disney+, etc.)
  rent?: TmdbWatchProvider[];              // alquiler
  buy?: TmdbWatchProvider[];               // compra
  free?: TmdbWatchProvider[];              // gratis
  ads?: TmdbWatchProvider[];               // con anuncios
  flatrate_and_buy?: TmdbWatchProvider[];  // combinada (a veces aparece)
}

/** Mapa país -> proveedores */
export interface TmdbWatchProvidersResults {
  [iso_3166_1: string]: TmdbWatchProvidersForCountry; // "ES", "US", "MX", ...
}

/** Respuesta completa de /{movie|tv}/{id}/watch/providers */
export interface TmdbWatchProviders {
  id: number; // id de la película/serie
  results: TmdbWatchProvidersResults;
}
