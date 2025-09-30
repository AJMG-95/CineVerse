import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MovieCardComponent } from '@movies/components/movie-card/movie-card.component';
import { TmdbApiMovieService } from '@movies/services/tmb-api-movie.service';
import { FilterByGenreComponent } from '@shared/components/filter-by-genre/filter-by-genre.component';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-similar-movies-page',
  imports: [MovieCardComponent, PaginatorComponent],
  templateUrl: './similar-movies-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimilarMoviesPageComponent {
  private activatedRoute = inject(ActivatedRoute);
  private apiMovieService = inject(TmdbApiMovieService);

  movieId = toSignal(
    this.activatedRoute.paramMap.pipe(map(pm => Number(pm.get('id')) || null)),
    { initialValue: null }
  );

  currentPage = signal<number>(1);
  selectedGenreIds = signal<number[]>([]);
  matchAll = signal<'AND' | 'OR'>('OR');

  similarsRes = resource({
    params: () => ({
      id: this.movieId(),
      page: this.currentPage()
    }),
    loader: async ({ params }) => {
      if (!params) return null;
      const { id, page } = params;
      if (!id) return null;
      return await firstValueFrom(this.apiMovieService.similar(id, page, 'es-ES'));
    },
  });



  movies = computed(() => this.similarsRes.value()?.results ?? [])

  similarToNameRes = resource({
    params: () => this.movieId(),
    loader: async ({ params: id }) => {
      if (!id) return null;
      const d = await firstValueFrom(this.apiMovieService.details(id, 'es-ES'));
      return d.title;
    }
  });

  // Título cómodo para la plantilla
  similarTitle = computed(() => {
    if (this.similarToNameRes.isLoading()) return 'Cargando…';
    if (this.similarToNameRes.error()) return 'Películas similares';
    return `Películas similares a ${this.similarToNameRes.value() ?? ''}`;
  });

  totalPages = computed(() => this.similarsRes.value()?.total_pages ?? 1);
  canPrev = computed(() => this.currentPage() > 1);
  canNext = computed(() => this.currentPage() < this.totalPages());

  goTo(page: number) {
    const p = Math.min(Math.max(1, page), this.totalPages());
    this.currentPage.set(p);
  }
}
