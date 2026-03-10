import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-detail-header',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './detail-header.html',
  styleUrl: './detail-header.scss',
})
export class DetailHeader {
  readonly backLabel = input.required<string>();
  readonly backRoute = input.required<string>();
}
