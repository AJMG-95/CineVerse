import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { TmdbMovie } from '../../interfaces/movie.interface';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'movies-carousel-swipper',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './movies-carousel-swipper.component.html',
  styles: `
  .swiper {
    width: 100%,
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesCarouselSwipperComponent implements AfterViewInit {
  movies = input.required<TmdbMovie[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  ngAfterViewInit(): void {
    const element = this.swiperDiv().nativeElement;
    if (!element) return;

    const swiper = new Swiper( element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [
        Navigation,
        Pagination
      ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
