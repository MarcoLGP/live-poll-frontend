import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '@services/auth';

/** Validador customizado: confirma que as duas senhas coincidem */
function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password    = control.get('newPassword')?.value;
  const confirm     = control.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordsMismatch: true } : null;
}

type FormState = 'idle' | 'loading' | 'success' | 'invalidToken';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss']
})
export class ResetPasswordComponent implements OnInit {
  private fb        = inject(FormBuilder);
  private auth      = inject(AuthService);
  private route     = inject(ActivatedRoute);
  private router    = inject(Router);
  private translate = inject(TranslateService);
  private cdr       = inject(ChangeDetectorRef);

  private token = '';
  state: FormState = 'idle';
  serverError: string | null = null;

  showNewPassword     = false;
  showConfirmPassword = false;

  form: FormGroup = this.fb.group(
    {
      newPassword:     ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordsMatchValidator }
  );

  get newPassword()     { return this.form.get('newPassword')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.state = 'invalidToken';
      this.cdr.markForCheck();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state = 'loading';
    this.serverError = null;

    this.auth.confirmPasswordReset({
      token: this.token,
      newPassword: this.newPassword.value
    }).subscribe({
      next: () => {
        this.state = 'success';
        this.cdr.markForCheck();
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        if (err.status === 400) {
          this.state = 'invalidToken';
        } else {
          this.state = 'idle';
          this.serverError = this.translate.instant('AUTH.RESET_SERVER_ERROR');
        }
        this.cdr.markForCheck();
      }
    });
  }
}