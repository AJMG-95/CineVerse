import { ChangeDetectionStrategy, Component, computed, ElementRef, input, ViewChild } from '@angular/core';
import { TmdbLogoSize } from '@shared/interfaces/images.interface';


export type CastItem = {
  id: number;
  name: string;
  character?: string | null;
  profile_path?: string | null;
};

@Component({
  selector: 'cast-trip',
  standalone: true,
  imports: [],
  templateUrl: './cast-trip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CastTripComponent {
  title = input<string>('Reparto');
  cast = input<CastItem[]>([]);
  imgSize = input<TmdbLogoSize>('w185');
  limit = input<number | null>(null);

  items = computed(() => {
    const data = this.cast() ?? [];
    const lim = this.limit();
    return (lim && lim > 0) ? data.slice(0, lim) : data;
  });

  imgUrl = (profilePath?: string | null) =>
    profilePath ? `https://image.tmdb.org/t/p/${this.imgSize()}/${profilePath}` : null;

  @ViewChild('strip', { static: true }) strip?: ElementRef<HTMLUListElement>;

  scroll(direction: 1 | -1) {
    const el = this.strip?.nativeElement;
    if (!el) return;
    // Desplaza por “páginas” (aprox. 3 tarjetas); ajusta a tu gusto
    const cardWidth = 140 + 16; // w-[140px] + gap-4(=16px)
    const delta = direction * cardWidth * 3;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }
 }
