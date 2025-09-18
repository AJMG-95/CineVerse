// movie-card.component.ts
import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, resource, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LocalListsService } from '@shared/services/local-lists.service';
import { firstValueFrom } from 'rxjs';
import { NumberPipe } from '../../../core/pipes/number.pipe';
import { TmdbImgPipe } from '../../../core/pipes/TmdbImg.pipe';
import { TmdbMovie } from '../../interfaces/movie.interface';
import { TmdbApiMovieService } from '../../services/tmb-api-movie.service';


@Component({
  selector: 'movie-card',
  standalone: true,
  imports: [TmdbImgPipe, NumberPipe, DecimalPipe, NgClass],
  templateUrl: './movie-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  private router = inject(Router);
  private mdbService = inject(TmdbApiMovieService);
  private localStorageService = inject(LocalListsService)

  private static activeId = signal<number | null>(null);
  movie = input.required<TmdbMovie>();
  isActive = computed(() => MovieCardComponent.activeId() === this.movie().id);



  detailsRes = resource({
    params: () => (this.isActive() ? this.movie().id : null),
    loader: async ({ params }) => params == null ? null : await firstValueFrom(this.mdbService.details(params, 'es-ES')),
  });

  // Al hacer click, activamos esta y desactivamos cualquier otra
  onClick() {
    const id = this.movie().id;
    MovieCardComponent.activeId.update(cur => cur === id ? null : id); // toggle

    // Si no se quiere toggle (que no se apague con reclick):
    // DescriptionCardComponent.activeId.set(id);
  }

  goToDetail(ev: Event) {
    ev.stopPropagation(); // evita togglear la card
    ev.preventDefault();
    const id = this.movie().id;
    MovieCardComponent.activeId.set(null)
    this.router.navigate(['/cineverse', 'movies', 'detail'], {
      queryParams: { id },
    });
  }


  isInFavorites = computed(() => this.localStorageService.isMovieInFavorites(this.movie().id) );
  isInWatched = computed(() => this.localStorageService.isMovieInWatched(this.movie().id) );
  isInList = computed(() => this.localStorageService.isMovieInList(this.movie().id) );


  toggleFavorite(ev: Event) {
    ev.stopPropagation();
    const m = this.movie();
    this.isInFavorites()
      ? this.localStorageService.removeMovieFromFavorites(m.id)
      : this.localStorageService.addMovieToFavorites(m);
  }

  toggleList(ev: Event) {
    ev.stopPropagation();
    const m = this.movie();
    this.isInList()
      ? this.localStorageService.removeMovieFromList(m.id)
      : this.localStorageService.addMovieToList(m);
  }

  toggleWatched(ev: Event) {
    ev.stopPropagation();
    const m = this.movie();
    this.isInWatched()
      ? this.localStorageService.removeMovieFromWatched(m.id)
      : this.localStorageService.addMovieToWatched(m);
  }

}
