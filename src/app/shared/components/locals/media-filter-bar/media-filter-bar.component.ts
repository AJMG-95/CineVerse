import { ChangeDetectionStrategy, Component, inject, input, output, resource } from '@angular/core';
import { MediaType, TmdbGenre, TmdbGenresService } from '@shared/services/tmdb-genres.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'media-filter-bar',
  imports: [],
  templateUrl: './media-filter-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaFilterBarComponent {
  private genresService = inject(TmdbGenresService);

  media = input<MediaType>('movie');
  language = input<string>('es-ES');

  search = input<string>('');
  selectedGenres = input<number[]>([]);
  matchAll = input<boolean>(false);

  searchChange = output<string>();
  selectedGenresChange = output<number[]>();
  matchAllChange = output<boolean>();

  genresRes = resource({
    params: () => `${this.media()}|${this.language()}`,
    loader: async () => await firstValueFrom(this.genresService.getAll(this.media())),
  });

  onSearchInput(ev: Event) {
    const v = (ev.target as HTMLInputElement).value ?? '';
    this.searchChange.emit(v);
  }

  toggleGenre(id: number) {
    const cur = this.selectedGenres();
    const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
    this.selectedGenresChange.emit(next);
  }

  clearGenres() { this.selectedGenresChange.emit([]); }

  onMatchAllChange(ev: Event) {
    const v = (ev.target as HTMLInputElement).checked;
    this.matchAllChange.emit(v);
  }

  isSelected(id: number) { return this.selectedGenres().includes(id); }
 }
