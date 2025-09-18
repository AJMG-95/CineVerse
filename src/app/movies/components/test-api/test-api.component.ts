import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbApiMovieService} from '../../services/tmb-api-movie.service';
import { TmdbMovie } from '../../interfaces/movie.interface';

@Component({
  standalone: true,
  selector: 'test-api',
  imports: [CommonModule],
  template: `
    <section class="p-4">
      <h2>Populares (primeros 8)</h2>
      <p *ngIf="loading()">Cargando…</p>
      <ul *ngIf="!loading()">
        <li *ngFor="let m of movies().slice(0,8)">
          {{ m.title }} ({{ m.release_date }}) — ★ {{ m.vote_average | number:'1.1-1' }}
        </li>
      </ul>
      <button (click)="loadMore()">Siguiente página</button>
    </section>
  `
})
export class TestApiComponent {
  private page = signal(1);
  movies = signal<TmdbMovie[]>([]);
  loading = signal(false);

  constructor(private api: TmdbApiMovieService) {
    this.fetch();
  }

  fetch() {
    this.loading.set(true);
    this.api.popular(this.page()).subscribe({
      next: res => { this.movies.set(res.results); this.loading.set(false); },
      error: err => { console.error('API error', err); this.loading.set(false); }
    });
  }

  loadMore() { this.page.update(p => p + 1); this.fetch(); }
}
