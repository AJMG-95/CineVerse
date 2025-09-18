// CineVerse\src\app\movies\movie.routes.ts

import { Routes } from "@angular/router";
import { MovieLayoutComponent } from "../movies/layouts/movieLayout/movieLayout.component";
import { MovieDetailPageComponent } from "../movies/pages/movie-detail-page/movie-detail-page.component";
import { MoviesHomeComponent } from "../movies/pages/movies-home/movies-home.component";
import { FavoritePageComponent } from "./pages/favorite-page/favorite-page.component";
import { SearchPageComponent } from "./pages/search-page/search-page.component";
import { MyListPageComponent } from "./pages/my-List-page/my-list-page.component";
import { WatchedMoviesPageComponent } from "./pages/watched-movies-page/watched-movies-page.component";
import { PopularMoviesPageComponent } from "./pages/popular-movies-page/popular-movies-page.component";
import { TopRatedMoviesPageComponent } from "./pages/top-rated-movies-page/top-rated-movies-page.component";
import { UpcomingMoviesPageComponent } from "./pages/upcoming-movies-page/upcoming-movies-page.component";
import { NowPlayingPageComponent } from "./pages/now-playing-page/now-playing-page.component";
import { SimilarMoviesPageComponent } from "./pages/similar-movies-page/similar-movies-page.component";


export const moviesRoutes: Routes = [
  {
    path: '',
    component: MovieLayoutComponent,
    children: [
      {
        path: '',
        title: 'Inicio',
        component: MoviesHomeComponent
      },
      {
        path: 'search',
        title: 'Buscar...',
        component: SearchPageComponent
      },
      {
        path: 'favorites',
        title: 'Favoritas',
        component: FavoritePageComponent
      },
      {
        path: 'my-list',
        title: 'Mi lista',
        component: MyListPageComponent
      },
      {
        path: 'watched-list',
        title: 'Vistas',
        component: WatchedMoviesPageComponent
      },
      {
        path: 'popular',
        title: 'Populares',
        component: PopularMoviesPageComponent,
        data: { hideInMenu: true }
      },
      {
        path: 'top-rated',
        title: 'Más votadas',
        component: TopRatedMoviesPageComponent,
        data: { hideInMenu: true }
      },
      {
        path: 'upcoming',
        title: 'Proximamente',
        component: UpcomingMoviesPageComponent,
        data: { hideInMenu: true }
      },
      {
        path: 'detail',
        title: 'Detalles de ',
        component: MovieDetailPageComponent,
        data: { hideInMenu: true }
      },
      {
        path: 'now_playing',
        title: 'En Cines ',
        component: NowPlayingPageComponent,
        data: { hideInMenu: true }
      },
      {
        path: ':id/similars',
        title: 'Películas similares',
        component: SimilarMoviesPageComponent,
        data: { hideInMenu: true }
      },
      { path: '**', redirectTo: '' },
    ]
  }
]

export default moviesRoutes;
