import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '@services/auth';

type FormState = 'idle' | 'loading' | 'sent';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {
  private fb        = inject(FormBuilder);
  private auth      = inject(AuthService);
  private translate = inject(TranslateService);
  private cdr       = inject(ChangeDetectorRef);

  state: FormState = 'idle';
  serverError: string | null = null;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get email() { return this.form.get('email')!; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state = 'loading';
    this.serverError = null;

    this.auth.requestPasswordReset({ email: this.email.value }).subscribe({
      next: () => {
        this.state = 'sent';
        this.cdr.markForCheck();
      },
      error: () => {
        this.state = 'sent';
        this.cdr.markForCheck();
      }
    });
  }
}