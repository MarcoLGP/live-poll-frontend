import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { simpleGoogle, simpleGithub } from '@ng-icons/simple-icons';
import { AuthService, LoginDTO } from '@services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, NgIconComponent, RouterLink],
  viewProviders: [provideIcons({ simpleGoogle, simpleGithub })],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loginError: string | null = null;

  doLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginError = null;

    const dto: LoginDTO = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(dto).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        if (err.status === 401) {
          this.loginError = this.translate.instant('AUTH.LOGIN_ERROR_INVALID');
        } else {
          this.loginError = this.translate.instant('AUTH.LOGIN_ERROR_SERVER');
        }
        this.cdr.markForCheck();
      }
    });
  }

  loginWithGitHub() {
    this.authService.loginWithGitHub();
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}