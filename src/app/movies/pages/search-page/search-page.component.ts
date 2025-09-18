import { ChangeDetectionStrategy, Component, computed, effect, inject, resource, signal } from '@angular/core';
import { MovieCardComponent } from '@movies/components/movie-card/movie-card.component';
import { TmdbApiMovieService } from '@movies/services/tmb-api-movie.service';
import { FilterByGenreComponent } from '@shared/components/filter-by-genre/filter-by-genre.component';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { firstValueFrom } from 'rxjs';


type SearchMode = 'search' | 'discover';
type SortOrder = 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc';
@Component({
  selector: 'app-search-page',
  imports: [PaginatorComponent, MovieCardComponent, FilterByGenreComponent],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  private mdbService = inject(TmdbApiMovieService);

  query = signal<string>('');
  currentPage = signal<number>(1);
  selectedGenreIds = signal<number[]>([]);
  matchAllGenres = signal<'AND' | 'OR'>('OR');
  includeAdultFlag = signal<boolean>(false);
  sortBy = signal<SortOrder>('popularity.desc');
  releaseYear = signal<number | null>(null);
  minVotes = signal<number>(200);

  searchMode = computed<SearchMode>(() => this.query().trim() ? 'search' : 'discover');

  resultsRes = resource({
    params: () => ({
      mode: this.searchMode(),
      q: this.query().trim(),
      page: this.currentPage(),
      genres: this.selectedGenreIds(),
      match: this.matchAllGenres(),
      includeAdult: this.includeAdultFlag(),
      sortBy: this.sortBy(),
      year: this.releaseYear(),
      minVotes: this.minVotes(),
    }),
    loader: async ({ params }) => {
      const { mode, q, page, genres, match, includeAdult, sortBy, year, minVotes } = params;
      if (mode === 'search') {
        return await firstValueFrom(this.mdbService.search(q, page, 'es-ES', includeAdult, year ?? undefined));
      }
      return await firstValueFrom(this.mdbService.discoverMovies({
        genreIds: genres,
        page,
        language: 'es-ES',
        match,
        sortBy,
        includeAdult,
        year: year ?? undefined,
        minVoteCount: sortBy === 'vote_average.desc' ? minVotes : undefined,
      }));
    },
  });

  movies = computed(() => this.resultsRes.value()?.results ?? []);
  totalPages = computed(() => this.resultsRes.value()?.total_pages ?? 1);

  private _clampPage = effect(() => {
    const total = this.totalPages();
    const p = this.currentPage();
    if (p > total) this.currentPage.set(total);
    if (p < 1) this.currentPage.set(1);
  });


  setQuery(v: string) { this.query.set(v); this.currentPage.set(1); }
  setIncludeAdult(v: boolean) { this.includeAdultFlag.set(v); this.currentPage.set(1); }
  setYear(raw: string) {
    const t = raw.trim();
    this.releaseYear.set(t === '' ? null : Number(t));
    this.releaseYear.set(1);
  }
  setOrder(v: string) {
    if (v === 'popularity.desc' || v === 'vote_average.desc' || v === 'primary_release_date.desc') {
      this.sortBy.set(v);
      this.currentPage.set(1);
    }
  }
  setMinVotes(raw: string) {
    const n = Number(raw);
    this.minVotes.set(Number.isFinite(n) && n >= 0 ? n : 0);
    this.currentPage.set(1);
  }

  onGenresChange(ids: number[]) { this.selectedGenreIds.set(ids); this.currentPage.set(1); }
  onMatchAllChange(b: boolean) { this.matchAllGenres.set(b ? 'AND' : 'OR'); this.currentPage.set(1); }
  goTo = (p: number) => this.currentPage.set(Math.min(Math.max(1, p), this.totalPages()));
}
