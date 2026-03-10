import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-user-detail-error',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './user-detail-error.html',
  styleUrl: './user-detail-error.scss',
})
export class UserDetailError {
  @Input({ required: true }) message!: string;
}
