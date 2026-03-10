import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserEntity } from '@models/auth/auth-entity.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-user-profile-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './user-profile-card.html',
  styleUrl: './user-profile-card.scss',
})
export class UserProfileCard {
  @Input({ required: true }) user!: UserEntity;
  @Output() logout = new EventEmitter<void>();
}
