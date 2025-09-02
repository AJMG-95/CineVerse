import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-movies-home',
  imports: [],
  templateUrl: './movies-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesHomeComponent { }
