import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { MovieCardComponent } from '@movies/components/movie-card/movie-card.component';
import { MediaFilterBarComponent } from '@shared/components/locals/media-filter-bar/media-filter-bar.component';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { LocalListsService } from '@shared/services/local-lists.service';

@Component({
  selector: 'watched-movies-page',
  imports: [MovieCardComponent, MediaFilterBarComponent, PaginatorComponent],
  templateUrl: './watched-movies-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchedMoviesPageComponent {
  private localStorageService = inject(LocalListsService)

  watchedMovies = this.localStorageService.movieWatched();

  search = signal<string>('');
  selectedGenres = signal<number[]>([]);
  matchAll = signal<boolean>(false); // false = OR (cualquiera) | true = AND (todas)

  pageSize = signal<number>(20);
  currentPage = signal<number>(1);

  private _resetOnFilters = effect(() => {
    this.search();
    this.selectedGenres();
    this.matchAll();
    this.currentPage.set(1);
  });


  filteredMovies = computed(() => {
    const query = this.search().trim().toLowerCase();
    const sel = this.selectedGenres();
    const requireAll = this.matchAll();

    return this.watchedMovies().filter(m => {
      // texto (en title u original_title)
      const byText =
        !query ||
        m.title.toLowerCase().includes(query) ||
        (m.original_title?.toLowerCase().includes(query));

      // géneros
      const byGenres =
        sel.length === 0
          ? true
          : (requireAll
            ? sel.every(g => m.genre_ids?.includes(g))   // AND: debe incluir todos
            : sel.some(g => m.genre_ids?.includes(g)));   // OR: con que incluya uno vale

      return byText && byGenres;
    });
  });

  totalPages = computed(() => {
    const total = this.filteredMovies().length;
    const size = Math.max(1, this.pageSize());
    return Math.max(1, Math.ceil(total / size));
  });

  pagedMovies = computed(() => {
    const page = Math.min(this.currentPage(), this.totalPages());
    const size = Math.max(1, this.pageSize());
    const start = (page - 1) * page;
    return this.filteredMovies().slice(start, start + size);
  });

  goTo = (p: number) => {
    const clamped = Math.min(Math.max(1, p), this.totalPages());
    this.currentPage.set(clamped);
  }
 }
