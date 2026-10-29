import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-user-detail-error',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './user-detail-error.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class UserDetailError {
  @Input({ required: true }) message!: string;
}
