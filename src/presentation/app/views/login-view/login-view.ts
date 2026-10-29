import { DetailHeader } from '../../../shared/components/detail-header/detail-header';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { LoginViewModel } from './viewmodel/login.viewmodel';
import { LoginHeader } from './components/login-header/login-header';
import { LoginForm, LoginFormValue } from './components/login-form/login-form';
import { LoginFooter } from './components/login-footer/login-footer';

@Component({
  selector: 'app-login-view',
  imports: [DetailHeader, LoginHeader, LoginForm, LoginFooter],
  providers: [LoginViewModel],
  templateUrl: './login-view.html',
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LoginView {
  protected readonly vm = inject(LoginViewModel);

  protected onSubmit({ username, password }: LoginFormValue): void {
    this.vm.login(username, password);
  }
}
