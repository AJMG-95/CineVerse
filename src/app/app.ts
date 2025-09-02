import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestApiComponent } from './movies/components/test-api/test-api.component';
import { CvFooterComponent } from './shared/components/cv-footer/cv-footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CvFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CineVerse');
}
