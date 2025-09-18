import { ChangeDetectionStrategy, Component, input, signal, computed, effect } from '@angular/core';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { TmdbMovie } from '../../interfaces/movie.interface';

@Component({
  selector: 'movies-carousel',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './movies-carousel.component.html',
  styleUrls: ['./movies-carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesCarouselComponent {
  movies = input.required<TmdbMovie[]>();
  transitionMs = input(380); // prueba 360–450
  ease = input('cubic-bezier(0.22,1,0.36,1)'); // easeOutQuart-ish

  // Layout
  slideWidth = 260; // px
  gap = 24;         // px

  // Estado
  current = signal(0);           // índice absoluto sobre la pista extendida
  withTransition = signal(true); // apagamos/encendemos transición para rebase
  private bootstrapped = signal(false);

  // Base y vista extendida (prev|curr|next) con CLAVES ÚNICAS
  base = computed(() => this.movies() ?? []);
  baseLen = computed(() => this.base().length);

  view = computed(() => {
    const b = this.base();
    if (!b.length) return [] as { m: TmdbMovie; key: string }[];

    const vPrev = b.map((m, i) => ({ m, key: `p-1-${i}-${m.id}` }));
    const vCurr = b.map((m, i) => ({ m, key: `p0-${i}-${m.id}` }));
    const vNext = b.map((m, i) => ({ m, key: `p1-${i}-${m.id}` }));
    return [...vPrev, ...vCurr, ...vNext];
  });

  // Arrancamos centrados: índice = len (empieza en la lista del medio)
  constructor() {
    effect(() => {
      const len = this.baseLen();
      if (len > 0 && !this.bootstrapped()) {
        this.withTransition.set(false);
        this.current.set(len);            // centro exacto
        // forzar un frame sin transición y reactivarla (sin FOUC)
        requestAnimationFrame(() => {
          // fuerza reflow para asegurar el off->on de la transición
          // (en algunos navegadores evita micro-parpadeo)
          void document.body.offsetWidth;
          this.withTransition.set(true);
          this.bootstrapped.set(true);
        });
      }
    });
  }

  // Navegación
  next() {
    if (!this.baseLen()) return;
    this.withTransition.set(true);
    this.current.update(i => i + 1);
  }

  prev() {
    if (!this.baseLen()) return;
    this.withTransition.set(true);
    this.current.update(i => i - 1);
  }

  // Al terminar la animación, recentramos si salimos del bloque central
  onTransitionEnd() {
    const len = this.baseLen();
    if (!len) return;

    const idx = this.current();

    // Si pasamos al bloque "next" (>= 2*len), restamos len y NO animamos el rebase.
    if (idx >= 2 * len) {
      this.withTransition.set(false);
      this.current.set(idx - len);
      // doble RAF: garantiza que el navegador aplica el estilo sin transición antes de reactivarla
      requestAnimationFrame(() => {
        void document.body.offsetWidth;
        this.withTransition.set(true);
      });
      return;
    }

    // Si pasamos al bloque "prev" (< 0), sumamos len con el mismo truco
    if (idx < 0) {
      this.withTransition.set(false);
      this.current.set(idx + len);
      requestAnimationFrame(() => {
        void document.body.offsetWidth;
        this.withTransition.set(true);
      });
    }
  }

  // Helpers para plantilla
  stepPx(): number {
    return this.slideWidth + this.gap;
  }
}
