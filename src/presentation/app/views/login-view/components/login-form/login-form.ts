import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class LoginForm {
  @Input({ required: true }) isLoading!: boolean;
  @Input() error: string | null = null;
  @Output() submitted = new EventEmitter<LoginFormValue>();

  private readonly fb = inject(FormBuilder);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.isLoading) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.element.nativeElement.querySelector<HTMLInputElement>('input.ng-invalid')?.focus();
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }
}
