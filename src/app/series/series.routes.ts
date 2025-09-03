import { Routes } from "@angular/router";
import { SeriesLayoutComponent } from "./layouts/seriesLayout/seriesLayout.component";
import { SeriesHomeComponent } from "./series-home/series-home.component";



export const seriesRoutes: Routes = [
  {
    path: '',
    component: SeriesLayoutComponent,
    children: [
      {
        path: '',
        title: 'Inicio',
        component: SeriesHomeComponent
      },
      { path: '**', redirectTo: '' },
    ]
  }
]

export default seriesRoutes;
