import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { ImgFallbackDirective } from '@directives/img-fallback.directive';
@Component({
  selector: 'app-host',
  imports: [ImgFallbackDirective],
  template: '<img appImgFallback src="broken.jpg" alt="Product" />',
})
class Host {}
describe('ImgFallbackDirective', () => {
  it('handles a real image error event', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    expect(img.src).toContain('data:image/gif;base64');
    expect(img.style.opacity).toBe('0');
  });
});
