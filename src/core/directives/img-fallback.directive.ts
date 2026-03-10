import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: 'img[appImgFallback]',
  standalone: true,
})
export class ImgFallbackDirective {
  private readonly el = inject(ElementRef<HTMLImageElement>);

  @HostListener('error')
  onError(): void {
    const img = this.el.nativeElement;
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    img.style.opacity = '0';
  }
}
