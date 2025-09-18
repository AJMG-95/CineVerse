import { Routes } from '@angular/router';
import { SeriesLayoutComponent } from './layouts/seriesLayout/seriesLayout.component';
import { SeriesHomeComponent } from './pages/series-home/series-home.component';
import { TvSearchPageComponent } from './pages/tv-search-page/tv-search-page.component';
import { TvFavoritePgeComponent } from './pages/tv-favorite-pge/tv-favorite-pge.component';
import { TvListPageComponent } from './pages/tv-list-page/tv-list-page.component';
import { WatchedSeriesPageComponent } from './pages/watched-series-page/watched-series-page.component';
import { PopularTvComponent } from './pages/popular-tv/popular-tv.component';
import { TopRatedTvPageComponent } from './pages/top-rated-tv-page/top-rated-tv-page.component';
import { AiringTvPageComponent } from './pages/airing-tv-page/airing-tv-page.component';
import { TvDetailPageComponent } from './pages/tv-detail-page/tv-detail-page.component';

export const seriesRoutes: Routes = [
  {
    path: '',
    component: SeriesLayoutComponent,
    children: [
      {
        path: '',
        title: 'Inicio',
        component: SeriesHomeComponent,
      },
      {
        path: 'search',
        title: 'Buscar...',
        component: TvSearchPageComponent,
      },
      {
        path: 'favorites',
        title: 'Inicio',
        component: TvFavoritePgeComponent
      },
      {
        path: 'my-list',
        title: 'Mi lista',
        component: TvListPageComponent
      },
      {
        path: 'watched-list',
        title: 'Vistas',
        component: WatchedSeriesPageComponent
      },
      {
        path: 'popular',
        title: 'Populares',
        component: PopularTvComponent,
        data: { hideInMenu: true },
      },
      {
        path: 'top-rated',
        title: 'Más votadas',
        component: TopRatedTvPageComponent,
        data: { hideInMenu: true },
      },
      {
        path: 'airing_today',
        title: 'Nuevos episodios',
        component: AiringTvPageComponent,
        data: { hideInMenu: true },
      },
      {
        path: 'detail',
        title: 'Detalles de ',
        component: TvDetailPageComponent,
        data: { hideInMenu: true },
      },
      { path: '**', redirectTo: '' },
    ],
  },
];

export default seriesRoutes;
