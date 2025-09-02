import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-movie-layout',
  imports: [RouterOutlet],
  templateUrl: './movieLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieLayoutComponent { }
