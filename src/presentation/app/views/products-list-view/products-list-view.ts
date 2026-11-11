import {
  Component,
  OnDestroy,
  OnInit,
  effect,
  inject,
  viewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductsViewModel } from './viewmodel/products.viewmodel';
import { ProductsHeader } from './components/products-header/products-header';
import { ProductsGrid } from './components/products-grid/products-grid';
import { ProductsSkeleton } from './components/products-skeleton/products-skeleton';
import { ProductsError } from './components/products-error/products-error';

@Component({
  selector: 'app-products-list-view',
  imports: [TranslatePipe, ProductsHeader, ProductsGrid, ProductsSkeleton, ProductsError],
  providers: [ProductsViewModel],
  templateUrl: './products-list-view.html',
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProductsListView implements OnInit, OnDestroy {
  protected readonly vm = inject(ProductsViewModel);

  private readonly sentinelRef = viewChild<ElementRef<HTMLDivElement>>('sentinel');
  private observer: IntersectionObserver | null = null;

  constructor() {
    effect(() => {
      const el = this.sentinelRef()?.nativeElement;
      if (!el) return;
      this.observer?.disconnect();
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) this.vm.loadMore();
        },
        { threshold: 0.1 },
      );
      this.observer.observe(el);
    });
  }

  ngOnInit(): void {
    this.vm.init();
  }
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  protected onSearchInput(value: string): void {
    this.vm.updateSearchTerm(value);
  }
}
