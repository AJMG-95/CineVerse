import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { MovieCardComponent } from '@movies/components/movie-card/movie-card.component';
import { TmdbApiMovieService } from '@movies/services/tmb-api-movie.service';
import { FilterByGenreComponent } from '@shared/components/filter-by-genre/filter-by-genre.component';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-top-rated-movies-page',
  imports: [MovieCardComponent, FilterByGenreComponent, PaginatorComponent],
  templateUrl: './top-rated-movies-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopRatedMoviesPageComponent {
  private mdbService = inject(TmdbApiMovieService);

  currentPage = signal<number>(1);
  selectedGenreIds = signal<number[]>([]);
  matchAll = signal<'AND' | 'OR'>('OR');
  minVotes = signal<number>(200);

  topRatedRes = resource({
    params: () => ({
      page: this.currentPage(),
      genres: this.selectedGenreIds(),
      match: this.matchAll(),
      minVotes: this.minVotes(),
    }),
    loader: async ({ params }) => {
      const { page, genres, match, minVotes } = params;
      return await firstValueFrom(this.mdbService.topRated(page, 'es-ES', genres, match, minVotes));
    },
  });

  totalPages = computed(() => this.topRatedRes.value()?.total_pages ?? 1);
  canPrev = computed(() => this.currentPage() > 1);
  canNext = computed(() => this.currentPage() < this.totalPages());

  goTo(page: number) {
    const p = Math.min(Math.max(1, page), this.totalPages());
    this.currentPage.set(p);
  }
}
