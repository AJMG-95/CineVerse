import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TmdbApiService } from '../../services/tmb-api.service';

@Component({
  selector: 'app-movies-home',
  imports: [],
  templateUrl: './movies-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesHomeComponent {
  mdbService = inject(TmdbApiService)

  popularRes = resource({
    loader: async () => {
      const res = await firstValueFrom(this.mdbService.popular());
      return res.results.slice(0, 10);
    },
  });



}
