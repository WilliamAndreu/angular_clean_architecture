import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login-footer',
  standalone: true,
  templateUrl: './login-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class LoginFooter {}
