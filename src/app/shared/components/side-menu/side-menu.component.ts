// src/app/shared/components/side-menu/side-menu.component.ts
import { Component, computed, inject } from '@angular/core';
import {
  NavigationEnd, Router, RouterLink, RouterLinkActive,
  Route, Routes
} from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import moviesRoutes from '../../../movies/movie.routes';
import seriesRoutes from '../../../series/series.routes';
import { MenuRoute, UrlHelper } from '../../helper/url.helper';

export interface MenuItem { title: string; route: string; }


const moviesChildren = UrlHelper.childRoutesOf(moviesRoutes as ReadonlyArray<MenuRoute>);
const seriesChildren = UrlHelper.childRoutesOf(seriesRoutes as ReadonlyArray<MenuRoute>);

@Component({
  selector: 'side-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent {
  private router = inject(Router);

  // enlaces top-level
  homeItem: MenuItem = { title: 'Inicio', route: '/cineverse' };
  moviesItem: MenuItem = { title: 'Películas', route: '/cineverse/movies' };
  seriesItem: MenuItem = { title: 'Series', route: '/cineverse/series' };

  // submenús (ya sin '**', sin índice '', sin detail/ocultas)
  moviesMenu: MenuItem[] = UrlHelper.buildItems('/cineverse/movies', moviesChildren);
  seriesMenu: MenuItem[] = UrlHelper.buildItems('/cineverse/series', seriesChildren);

  // URL reactiva
  currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  // mostrar submenús según URL
  isMovies = computed(() => this.currentUrl().startsWith('/cineverse/movies'));
  isSeries = computed(() => this.currentUrl().startsWith('/cineverse/series'));
}
