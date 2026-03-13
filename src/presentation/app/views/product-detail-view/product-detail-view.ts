import { Component, OnInit, inject, input } from '@angular/core';
import { ProductDetailViewModel } from './viewmodel/product-detail.viewmodel';
import { DetailHeader } from '@shared/components/detail-header/detail-header';
import { ProductGallery } from './components/product-gallery/product-gallery';
import { ProductInfo } from './components/product-info/product-info';
import { ProductDetailLoading } from './components/product-detail-loading/product-detail-loading';
import { ProductDetailError } from './components/product-detail-error/product-detail-error';

@Component({
  selector: 'app-product-detail-view',
  imports: [DetailHeader, ProductGallery, ProductInfo, ProductDetailLoading, ProductDetailError],
  providers: [ProductDetailViewModel],
  templateUrl: './product-detail-view.html',
  styleUrl: './product-detail-view.scss',
  standalone: true,
})
export class ProductDetailView implements OnInit {
  readonly id = input.required<string>();
  protected readonly vm = inject(ProductDetailViewModel);

  ngOnInit(): void {
    this.vm.load(Number(this.id()));
  }
}
