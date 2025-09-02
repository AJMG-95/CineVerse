import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-series-layout',
  imports: [RouterOutlet],
  templateUrl: './seriesLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesLayoutComponent { }
