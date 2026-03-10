import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'price', standalone: true, pure: true })
export class PricePipe implements PipeTransform {
  transform(value: number): string {
    return `$${value.toFixed(2)}`;
  }
}
