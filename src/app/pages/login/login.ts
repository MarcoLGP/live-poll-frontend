import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { simpleGoogle, simpleGithub } from '@ng-icons/simple-icons';
import { CommonModule } from '@angular/common';
import { AuthService, LoginDTO } from '@services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, NgIconComponent, RouterLink],
  viewProviders: [provideIcons({ simpleGoogle, simpleGithub })],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    usernameOrEmail: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loginError: string | null = null;

  doLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const dto: LoginDTO = {
      usernameOrEmail: this.loginForm.value.usernameOrEmail,
      password: this.loginForm.value.password
    };

    this.authService.login(dto).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        if (err.status === 401 || err.status === 400) {
          this.loginError = 'Credenciais inválidas. Tente novamente.';
        } else {
          this.loginError = 'Erro no servidor. Tente mais tarde.';
        }
      }
    });
  }

  demoLogin() {
    this.loginForm.patchValue({
      usernameOrEmail: 'testuser',
      password: 'senha123'
    });
    this.doLogin();
  }
}