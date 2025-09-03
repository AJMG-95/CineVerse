import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestApiComponent } from './movies/components/test-api/test-api.component';
import { CvFooterComponent } from './shared/components/cv-footer/cv-footer.component';
import { SideMenuComponent } from './shared/components/side-menu/side-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CvFooterComponent, SideMenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CineVerse');
}
