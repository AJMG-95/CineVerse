import { ChangeDetectionStrategy, Component, input, signal, computed, effect } from '@angular/core';
import { TvCardComponent } from '../../components/tv-card/tv-card.component';
import { TmdbTv } from '../../interfaces/TmdbTv.interface';

@Component({
  selector: 'series-carousel',
  standalone: true,
  imports: [TvCardComponent],
  templateUrl: './series-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesCarouselComponent {
  series = input.required<TmdbTv[]>();
  transitionMs = input(380);
  ease = input('cubic-bezier(0.22,1,0.36,1)');

  // Layout
  slideWidth = 260; // px
  gap = 24;         // px

  // Estado
  current = signal(0);
  withTransition = signal(true);
  private bootstrapped = signal(false);

  // Base y vista extendida (prev|curr|next) con claves únicas
  base = computed(() => this.series() ?? []);
  baseLen = computed(() => this.base().length);

  view = computed(() => {
    const b = this.base();
    if (!b.length) return [] as { s: TmdbTv; key: string }[];

    const vPrev = b.map((s, i) => ({ s, key: `p-1-${i}-${s.id}` }));
    const vCurr = b.map((s, i) => ({ s, key: `p0-${i}-${s.id}` }));
    const vNext = b.map((s, i) => ({ s, key: `p1-${i}-${s.id}` }));
    return [...vPrev, ...vCurr, ...vNext];
  });

  constructor() {
    effect(() => {
      const len = this.baseLen();
      if (len > 0 && !this.bootstrapped()) {
        this.withTransition.set(false);
        this.current.set(len);
        requestAnimationFrame(() => {
          void document.body.offsetWidth;
          this.withTransition.set(true);
          this.bootstrapped.set(true);
        });
      }
    });
  }

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

  onTransitionEnd() {
    const len = this.baseLen();
    if (!len) return;
    const idx = this.current();

    if (idx >= 2 * len) {
      this.withTransition.set(false);
      this.current.set(idx - len);
      requestAnimationFrame(() => {
        void document.body.offsetWidth;
        this.withTransition.set(true);
      });
      return;
    }

    if (idx < 0) {
      this.withTransition.set(false);
      this.current.set(idx + len);
      requestAnimationFrame(() => {
        void document.body.offsetWidth;
        this.withTransition.set(true);
      });
    }
  }

  stepPx(): number {
    return this.slideWidth + this.gap;
  }
}
