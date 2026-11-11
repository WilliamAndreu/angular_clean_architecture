import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-user-detail-skeleton',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './user-detail-skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class UserDetailSkeleton {}
