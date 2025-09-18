import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'km', standalone: true })
export class NumberPipe implements PipeTransform {
  transform(value: number | null | undefined, digits = 1, locale = 'es-ES'): string {
    if (value == null) return '';
    const abs = Math.abs(value);
    const fmt = (n: number) =>
      new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: digits }).format(n);

    if (abs >= 1_000_000) return `${fmt(value / 1_000_000)}M`;
    if (abs >= 1_000) return `${fmt(value / 1_000)}K`;
    return fmt(value);
  }
}
