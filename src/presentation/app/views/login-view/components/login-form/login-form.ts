import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  @Input({ required: true }) isLoading!: boolean;
  @Input() error: string | null = null;
  @Output() submitted = new EventEmitter<SubmitEvent>();
}
