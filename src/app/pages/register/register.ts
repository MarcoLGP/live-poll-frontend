import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { simpleGoogle, simpleGithub } from '@ng-icons/simple-icons';
import { AuthService, RegisterDTO } from '@services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [TranslatePipe, NgIconComponent, ReactiveFormsModule, RouterLink],
  viewProviders: [provideIcons({ simpleGoogle, simpleGithub })],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  registerError: string | null = null;

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validator: this.passwordMatchValidator });

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  continueWithGh() {
    this.authService.loginWithGitHub();
  }

  continueWithGoogle() {
    this.authService.loginWithGoogle();
  }

  doRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.registerError = null;

    const dto: RegisterDTO = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      language: this.translate.getCurrentLang() || 'pt-BR',
      password: this.registerForm.value.password
    };

    this.authService.register(dto).subscribe({
      next: () => this.router.navigate(['/register/confirmation']),
      error: (err) => {
        if (err.status === 400 || err.status === 409) {
          this.registerError = this.translate.instant('AUTH.REGISTER_ERROR_EMAIL_TAKEN');
        } else {
          this.registerError = this.translate.instant('AUTH.REGISTER_ERROR_SERVER');
        }
        this.cdr.markForCheck();
      }
    });
  }
}