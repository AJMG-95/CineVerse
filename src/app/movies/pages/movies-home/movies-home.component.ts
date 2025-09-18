import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MoviesCarouselComponent } from '@movies/components/movies-carousel/movies-carousel.component';
import { TmdbApiMovieService } from '@movies/services/tmb-api-movie.service';
import { LocalListsService } from '@shared/services/local-lists.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movies-home',
  standalone:true,
  imports: [MoviesCarouselComponent, RouterLink],
  templateUrl: './movies-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesHomeComponent {
  private mdbService = inject(TmdbApiMovieService)
  private localStorageService = inject(LocalListsService)


  popularRes = resource({
    loader: async () => {
      const res = await firstValueFrom(this.mdbService.popular());
      return res.results.slice(0, 12);
    },
  });

  topRatedRes = resource({
    loader: async () => {
      const res = await firstValueFrom(this.mdbService.topRated());
      return res.results.slice(0, 12);
    }
  });


  upCommingRes = resource({
    loader: async () => {
      const res = await firstValueFrom(this.mdbService.upcoming());
      return res.results.slice(0, 12);
    }
  });


  favMovies = this.localStorageService.movieFavorites();
  hasFavs = computed(() => this.favMovies().length > 0);
  watchedMovies = this.localStorageService.movieWatched();
  haswatch = computed(() => this.watchedMovies().length > 0);
  movieList = this.localStorageService.movieList();
  hasMovies = computed(() => this.movieList().length > 0);



}
