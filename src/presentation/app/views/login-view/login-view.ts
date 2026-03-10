import { Component, inject } from '@angular/core';
import { LoginViewModel } from './viewmodel/login.viewmodel';
import { LoginHeader } from './components/login-header/login-header';
import { LoginForm } from './components/login-form/login-form';
import { LoginFooter } from './components/login-footer/login-footer';

@Component({
  selector: 'app-login-view',
  imports: [LoginHeader, LoginForm, LoginFooter],
  providers: [LoginViewModel],
  templateUrl: './login-view.html',
  styleUrl: './login-view.scss',
  standalone: true,
})
export class LoginView {
  protected readonly vm = inject(LoginViewModel);

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    this.vm.login(
      data.get('username') as string,
      data.get('password') as string,
    );
  }
}
