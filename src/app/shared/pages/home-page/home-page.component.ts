import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MoviesCarouselComponent } from '@movies/components/movies-carousel/movies-carousel.component';
import { TmdbApiMovieService } from '@movies/services/tmb-api-movie.service';
import { SeriesCarouselComponent } from '@series/components/series-carousel/series-carousel.component';
import { TmbApiTvService } from '@series/services/tmb-api-tv.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [MoviesCarouselComponent, SeriesCarouselComponent, RouterLink],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private tmdbMovieService = inject(TmdbApiMovieService);
  private tmdbTvService = inject(TmbApiTvService);

  nowPlayingMoviesRes = resource({
    loader: async () => {
      const res = await firstValueFrom(this.tmdbMovieService.nowPlaying());
      return res.results.slice(0, 12);
    },
  });


  onAirTvRes = resource({
    loader: async () => {
      const res = await firstValueFrom(this.tmdbTvService.onTheAir());
      return res.results.slice(0, 12);
    }
  });

/*   airingTodayTvRes = resource({
    loader: async () => {
      const res = await firstValueFrom(this.tmdbTvService.airingToday());
      return res.results.slice(0, 12);
    }
  }); */



}
