import { Pipe, PipeTransform } from '@angular/core';
import { ImagesUtil } from '../utils/images.util';

@Pipe({ name: 'tmdbImg', standalone: true })
export class TmdbImgPipe implements PipeTransform {
  transform(path?: string | null, size: any = 'w500'): string {
    return ImagesUtil.getImg(path, size);
  }
}
