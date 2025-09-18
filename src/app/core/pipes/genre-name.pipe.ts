import { Pipe, PipeTransform, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MediaType, TmdbGenresService } from '../../shared/services/tmdb-genres.service';


@Pipe({ name: 'genreName', standalone: true })
export class GenreNamePipe implements PipeTransform {
  private genres = inject(TmdbGenresService);
  transform(id: number | null | undefined, media: MediaType = 'movie'):
    Observable<string> {
    if (id == null) return of('');
    return this.genres.getNameById(id, media).pipe(map(n => n ?? ''));
  }
}
