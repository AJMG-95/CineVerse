// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cineverse' },

  {
    path: 'cineverse',
    children: [
      {
        path: 'movies',
        loadChildren: () => import('./movies/movie.routes').then((m) => m.default), // ← importante
        title: 'Películas · CineVerse',
      },
      {
        path: 'series',
        loadChildren: () => import('./series/series.routes').then((m) => m.default), // ← importante
        title: 'Series · CineVerse',
      },
      {
        path: '',
        loadChildren: () => import('./shared/shared.routes').then((m) => m.default), // ← importante
      },
      { path: '**', redirectTo: '404' },
    ],
  },

  { path: '**', redirectTo: 'cineverse/404' },
];
