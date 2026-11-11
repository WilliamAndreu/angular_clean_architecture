import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login-header',
  standalone: true,
  templateUrl: './login-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class LoginHeader {}
