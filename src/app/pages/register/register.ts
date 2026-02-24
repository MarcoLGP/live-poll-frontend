import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { simpleGoogle, simpleGithub } from '@ng-icons/simple-icons';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterDTO } from '@services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, TranslatePipe, NgIconComponent, ReactiveFormsModule, RouterLink],
  viewProviders: [provideIcons({ simpleGoogle, simpleGithub })],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

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

  doRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const dto: RegisterDTO = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(dto).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        console.error('Erro no registro', err);
        // Exibir mensagem amigável para o usuário
      }
    });
  }

  demoRegister() {
    this.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'senha123',
      confirmPassword: 'senha123'
    });
    this.doRegister();
  }
}