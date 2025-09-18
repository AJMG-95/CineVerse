import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'runtime',
  standalone: true,
  pure: true,
})
export class RuntimePipe implements PipeTransform {
  transform(
    totalMinutes: number | null | undefined,
    format: 'h:mm' | 'xh ym' = 'h:mm'
  ): string {
    if (totalMinutes == null || isNaN(totalMinutes)) return '';

    const mins = Math.max(0, Math.floor(totalMinutes));
    const h = Math.floor(mins / 60);
    const m = mins % 60;

    if (format === 'xh ym') return `${h}h ${m}m`;

    // 'h:mm' por defecto
    const mm = String(m).padStart(2, '0');
    return `${h}:${mm}`;
  }
}
