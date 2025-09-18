export class ImagesUtil {

  private static readonly BASE = 'https://image.tmdb.org/t/p';

  static getImg(path?: string | null, size:
    'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500',
    fallback: string = 'assets/images/placeholder-poster.webp'
  ): string {
    if (!path) return fallback;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${this.BASE}/${size}${clean}`;
  }
}
