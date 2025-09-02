import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-movie-detail-page',
  imports: [],
  templateUrl: './movie-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailPageComponent { }
