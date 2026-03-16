import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

export interface LoginFormValue {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  @Input({ required: true }) isLoading!: boolean;
  @Input() error: string | null = null;
  @Output() submitted = new EventEmitter<LoginFormValue>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitted.emit(this.form.getRawValue());
  }
}
