import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  templateUrl: './paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  // Inputs controlados por el padre
  page = input.required<number>();     // página actual (1..total)
  total = input.required<number>();     // páginas totales (>=1)

  siblingCount = input(1);              // nº de botones a cada lado (1 => [p-1, p, p+1])
  showFirstLast = input(true);          // mostrar « y »

  // Output hacia el padre
  pageChange = output<number>();

  // Helpers
  canPrev = computed(() => this.page() > 1);
  canNext = computed(() => this.page() < Math.max(1, this.total()));

  goTo(p: number) {
    const t = Math.max(1, this.total());
    const clamped = Math.min(Math.max(1, p), t);
    if (clamped !== this.page()) this.pageChange.emit(clamped);
  }
  prev() { if (this.canPrev()) this.goTo(this.page() - 1); }
  next() { if (this.canNext()) this.goTo(this.page() + 1); }

  // Rango de botones numéricos alrededor de la página actual
  pages = computed(() => {
    const t = Math.max(1, this.total());
    const p = this.page();
    const s = this.siblingCount();
    const start = Math.max(1, p - s);
    const end = Math.min(t, p + s);
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  });
}
