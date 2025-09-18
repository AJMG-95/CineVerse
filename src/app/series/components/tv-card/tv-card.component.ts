import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, resource, signal } from '@angular/core';
import { Router } from '@angular/router';

import { TmdbImgPipe } from '@core/pipes/TmdbImg.pipe';
import { NumberPipe } from '@core/pipes/number.pipe';

import { TmdbTv } from '@series/interfaces/TmdbTv.interface';
import { TmbApiTvService } from '@series/services/tmb-api-tv.service';

import { LocalListsService } from '@shared/services/local-lists.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'tv-card',
  standalone: true,
  imports: [TmdbImgPipe, NumberPipe, DecimalPipe, NgClass],
  templateUrl: './tv-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './tv-card.component.css', // igual que movie-card para ser consistentes
})
export class TvCardComponent {
  private router = inject(Router);
  private tvService = inject(TmbApiTvService);
  private localLists = inject(LocalListsService);

  private static activeId = signal<number | null>(null);

  tv = input.required<TmdbTv>();
  isActive = computed(() => TvCardComponent.activeId() === this.tv().id);

  // Cargamos detalles SOLO cuando la card está activa
  detailsRes = resource({
    params: () => (this.isActive() ? this.tv().id : null),
    loader: async ({ params }) =>
      params == null ? null : await firstValueFrom(this.tvService.details(params, 'es-ES')),
  });

  // Interacción
  onClick() {
    const id = this.tv().id;
    TvCardComponent.activeId.update(cur => (cur === id ? null : id)); // toggle
  }

  goToDetail(ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();
    const id = this.tv().id;
    TvCardComponent.activeId.set(null);
    this.router.navigate(['/cineverse', 'series', 'detail'], { queryParams: { id } });
  }


  isInFavorites = computed(() =>
    this.localLists.isTvInFavorites?.(this.tv().id) ?? false
  );
  isInWatched = computed(() =>
    this.localLists.isTvInWatched?.(this.tv().id) ?? false
  );
  isInList = computed(() =>
    this.localLists.isTvInList?.(this.tv().id) ?? false
  );

  toggleFavorite(ev: Event) {
    ev.stopPropagation();
    const s = this.tv();
    if (this.isInFavorites()) {
      this.localLists.removeTvFromFavorites?.(s.id);
    } else {
      this.localLists.addTvToFavorites?.(s);
    }
  }

  toggleList(ev: Event) {
    ev.stopPropagation();
    const s = this.tv();
    if (this.isInList()) {
      this.localLists.removeTvFromList?.(s.id);
    } else {
      this.localLists.addTvToList?.(s);
    }
  }

  toggleWatched(ev: Event) {
    ev.stopPropagation();
    const s = this.tv();
    if (this.isInWatched()) {
      this.localLists.removeTvFromWatched?.(s.id);
    } else {
      this.localLists.addTvToWatched?.(s);
    }
  }
}
