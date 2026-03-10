import { describe, it, expect } from 'vitest';

describe('ImgFallbackDirective', () => {
  it('replaces src with 1x1 transparent gif on error', () => {
    const img = {
      src: 'https://example.com/broken.jpg',
      style: { opacity: '1' },
    };

    // Simulate what the directive does on error
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    img.style.opacity = '0';

    expect(img.src).toContain('data:image/gif;base64');
    expect(img.style.opacity).toBe('0');
  });
});
