import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface link {
  url: string,
  label: string,
  iconUrl: string,
}

@Component({
  selector: 'cv-footer',
  imports: [],
  templateUrl: './cv-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvFooterComponent {
  links = signal<link[]>([
    {
      url: 'https://ajmg-95.github.io/portfolio/',
      label: 'Portfolio',
      iconUrl: 'assets/icons/me.webp',
    },
    {
      url: 'https://github.com/AJMG-95',
      label: 'GitHub',
      iconUrl: 'assets/icons/github_logo.webp',
    },
    {
      url: 'https://linkedin.com/in/aj-marchena',
      label: 'LinkedIn',
      iconUrl: 'assets/icons/linkedIn_logo.webp',
    },
  ]);
}
