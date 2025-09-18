
import { Component, ElementRef, ViewChild, inject, computed, signal, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TmdbVideo } from '@shared/interfaces/videos.interface';

@Component({
  selector: 'video-button',
  standalone: true,
  templateUrl: './video-button.component.html',
})
export class VideoButtonComponent {
  // Inputs con signals
  video = input<TmdbVideo | null>(null);
  label = input<string>('Ver tráiler');
  title = input<string | undefined>(undefined);

  @ViewChild('modal', { static: true }) modal?: ElementRef<HTMLDialogElement>;

  private sanitizer = inject(DomSanitizer);

  // Estado de visibilidad
  visible = signal(false);

  // ¿Se puede embeber?
  isEmbeddable = computed(() => {
    const v = this.video();
    return !!v && v.site === 'YouTube' && /^[\w-]{6,}$/.test(v.key);
  });

  // URL segura para el iframe (solo cuando visible y embebible)
  embedUrl = computed<SafeResourceUrl | null>(() => {
    const v = this.video();
    if (!this.visible() || !this.isEmbeddable() || !v) return null;
    const url = `https://www.youtube-nocookie.com/embed/${v.key}?autoplay=1&rel=0&modestbranding=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  open() {
    if (!this.isEmbeddable()) return;
    this.visible.set(true);
    this.modal?.nativeElement.showModal();
  }

  close() {
    this.visible.set(false);             // desmonta el iframe (embedUrl -> null)
    this.modal?.nativeElement.close();
  }

  // Se dispara al cerrar (botón ✕, backdrop o Esc)
  onDialogClose() {
    this.visible.set(false);
  }
}
