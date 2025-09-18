import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, LOCALE_ID, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NumberPipe } from '@core/pipes/number.pipe';
import { RuntimePipe } from '@core/pipes/runtime.pipe';
import { TmdbImgPipe } from '@core/pipes/TmdbImg.pipe';
import { MoviesCarouselComponent } from '@movies/components/movies-carousel/movies-carousel.component';
import { TmdbApiMovieService } from '@movies/services/tmb-api-movie.service';
import { CastTripComponent } from '@shared/components/cast-trip/cast-trip.component';
import { VideoButtonComponent } from '@shared/components/video-button/video-button.component';
import { LocalListsService } from '@shared/services/local-lists.service';
import { firstValueFrom, map } from 'rxjs';


@Component({
  selector: 'app-movie-detail-page',
  imports: [
    TmdbImgPipe,
    DecimalPipe,
    NumberPipe,
    RuntimePipe,
    NgClass,
    DatePipe,
    VideoButtonComponent,
    CastTripComponent,
    MoviesCarouselComponent,
    RouterLink
  ],
  templateUrl: './movie-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailPageComponent {
  private localStorageService = inject(LocalListsService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private mdbService = inject(TmdbApiMovieService);

  private locale = inject(LOCALE_ID); // p.ej. 'es-ES'
   countryCode = (this.locale.split('-')[3] ?? 'ES').toUpperCase(); // -> 'ES'


  // Lee ?id=... (y cae a /detail/:id si existiera)
  movieId = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((pm) => {
        const q = pm.get('id');
        if (q) return Number(q);
        return null;
      })
    ),
    { initialValue: null }
  );

  bundleRes = resource({
    params: () => this.movieId(),
    loader: async ({ params }) => {
      if (params == null) return null;
      const value = await firstValueFrom(
        this.mdbService.getMovieBundle(params, 'es-ES', 'es,en,null')
      );
      console.log(value);
      return value;
    },
  });

  movie = computed(() => this.bundleRes.value());
  posterPath = computed(() => {
    const m = this.movie();
    if (!m) return null;
    const posters = m.images?.posters ?? [];
    return posters.length ? posters[0].file_path : m.poster_path ?? null;
  });
  cast = computed(() => this.movie()?.credits?.cast ?? []);

  watchProvidersRaw = computed(() => {
    const m = this.movie();
    if (!m) return null;

    const withSlash = (m as any)['watch/providers'];
    if (withSlash?.results) return withSlash.results;

    if ((m as any).watchProviders?.results) return (m as any).watchProviders.results;

    return null;
  });

  watchProvidersES = computed(() => {
    const results = this.watchProvidersRaw();
    if (!results) return null;
    return results[this.countryCode] ?? results['ES'] ?? null; // fallback a ES
  });

  wpLink = computed(() => this.watchProvidersES()?.link ?? null);
  wpBuy = computed(() => this.watchProvidersES()?.buy ?? []);
  wpRent = computed(() => this.watchProvidersES()?.rent ?? []);
  wpFlatrate = computed(() => this.watchProvidersES()?.flatrate ?? []);

  similars = computed(() => {
    const m = this.movie();
    if (!m) return null;
    return m.similar.results.slice(0, 12)
  });

  isInFavorites = computed(() => {
    const m = this.movie();
    if (!m) return null;
    return this.localStorageService.isMovieInFavorites(m.id);
  });

  isInWatched = computed(() => {
    const m = this.movie();
    if (!m) return null;
    return this.localStorageService.isMovieInWatched(m.id);
  });
  isInList = computed(() => {
    const m = this.movie();
    if (!m) return null;
    return this.localStorageService.isMovieInList(m.id);
  });

  redirectEffect = effect(() => {
    if (this.bundleRes.error()) {
      this.router.navigate(['/cineverse'])
    }
  });

  toggleFavorite(ev: Event) {
    ev.stopPropagation();
    const m = this.movie();
    if (!m) return;
    this.isInFavorites()
      ? this.localStorageService.removeMovieFromFavorites(m.id)
      : this.localStorageService.addMovieToFavorites(m);
  }

  toggleList(ev: Event) {
    ev.stopPropagation();
    const m = this.movie();
    if (!m) return;
    this.isInList()
      ? this.localStorageService.removeMovieFromList(m.id)
      : this.localStorageService.addMovieToList(m);
  }

  toggleWatched(ev: Event) {
    ev.stopPropagation();
    const m = this.movie();
    if (!m) return;
    this.isInWatched()
      ? this.localStorageService.removeMovieFromWatched(m.id)
      : this.localStorageService.addMovieToWatched(m);
  }


}
