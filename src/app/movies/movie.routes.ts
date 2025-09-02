import { Routes } from "@angular/router";
import { MovieLayoutComponent } from "../movies/layouts/movieLayout/movieLayout.component";
import { MovieDetailPageComponent } from "../movies/pages/movie-detail-page/movie-detail-page.component";
import { MoviesHomeComponent } from "../movies/pages/movies-home/movies-home.component";
import { FavoritePageComponent } from "./pages/favorite-page/favorite-page.component";
import { SearchPageComponent } from "./pages/search-page/search-page.component";
import { WatchlistPageComponent } from "./pages/watchlist-page/watchlist-page.component";


export const moviesRoutes: Routes = [
  {
    path: '',
    component: MovieLayoutComponent,
    children: [
      {
        path: '',
        title: 'Películas',
        component: MoviesHomeComponent
      },
      {
        path: 'detail',
        title: 'Detalles de ',
        component: MovieDetailPageComponent
      },
      {
        path: 'favorites',
        title: 'Favoritas',
        component: FavoritePageComponent
      },
      {
        path: 'watch-list',
        title: 'Pendientes',
        component: WatchlistPageComponent
      },
      {
        path: 'search',
        title: 'Buscar...',
        component: SearchPageComponent
      },

      { path: '**', redirectTo: '' },
    ]
  }
]

export default moviesRoutes;
