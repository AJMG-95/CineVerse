// src/app/shared/shared.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import NotfoundPageComponent from './pages/notfound-page/notfound-page.component';


export const sharedRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent,
    title: 'Inicio · CineVerse',
  },
  {
    path: '404',
    component: NotfoundPageComponent,
    title: 'Página no encontrada · CineVerse',
  },
];

export default sharedRoutes;
