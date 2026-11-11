import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { UserDetailViewModel } from './viewmodel/user-detail.viewmodel';
import { DetailHeader } from '@shared/components/detail-header/detail-header';
import { UserProfileCard } from './components/user-profile-card/user-profile-card';
import { UserDetailSkeleton } from './components/user-detail-skeleton/user-detail-skeleton';
import { UserDetailError } from './components/user-detail-error/user-detail-error';

@Component({
  selector: 'app-user-detail-view',
  imports: [DetailHeader, UserProfileCard, UserDetailSkeleton, UserDetailError],
  providers: [UserDetailViewModel],
  templateUrl: './user-detail-view.html',
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UserDetailView implements OnInit {
  protected readonly vm = inject(UserDetailViewModel);

  ngOnInit(): void {
    this.vm.init();
  }
}
