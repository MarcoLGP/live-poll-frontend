import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './base-api';
import { TokenService } from './token-service';
import { environment } from '@env/environment';

export interface RegisterDTO { username: string; email: string; password: string; language: string; gradientAvatar?: boolean; socialLogin?: string; }
export interface LoginDTO { email: string; password: string; }
export interface AccessTokenResponse { accessToken: string; tokenType: string; user?: User; }
export interface User { name: string; handle: string; initials: string; }
export interface ChangePasswordDTO { currentPassword: string; newPassword: string; }
export interface EmailChangeRequestDTO { newEmail: string; }
export interface EmailConfirmDTO { token: string; }
export interface PasswordResetRequestDTO { email: string; }
export interface PasswordResetConfirmDTO { token: string; newPassword: string; }
export interface AccountConfirmDTO { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private _isLoggedInSignal = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedInSignal.asReadonly();

  /**
   * Registra novo usuário. O backend retorna uma mensagem solicitando
   * confirmação por e-mail — NÃO emite tokens ainda.
   */
  register(dto: RegisterDTO): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('auth/register', dto);
  }

  /**
   * Confirma o cadastro via token enviado por e-mail.
   * Retorna access token e seta o cookie de refresh token.
   */
  confirmAccount(dto: AccountConfirmDTO): Observable<AccessTokenResponse> {
    return this.api.post<AccessTokenResponse>('auth/account/confirm', dto).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  login(dto: LoginDTO): Observable<AccessTokenResponse> {
    return this.api.post<AccessTokenResponse>('auth/login', dto).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  loginWithGitHub(): void {
    window.location.href = environment.apiBaseUrl + '/auth/social/github/login';
  }

  loginWithGoogle(): void {
    window.location.href = environment.apiBaseUrl + '/auth/social/google/login';
  }

  handleSocialLoginResponse(accessToken: string): void {
    this.tokenService.setToken(accessToken);
    this._isLoggedInSignal.set(true);
  }

  refreshToken(): Observable<AccessTokenResponse> {
    return this.api.post<AccessTokenResponse>('auth/refresh-token', {}).pipe(
      tap({
        next: (response) => {
          this.tokenService.setToken(response.accessToken);
          this._isLoggedInSignal.set(true);
        },
        error: () => this._isLoggedInSignal.set(false)
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    this._isLoggedInSignal.set(false);
    this.router.navigate(['/login']);
    this.api.post('auth/logout', {}).subscribe({
      error: (err) => console.error('Erro ao fazer logout no backend', err)
    });
  }

  /**
   * Solicita o envio do e-mail de recuperação de senha.
   * O backend não revela se o e-mail existe ou não.
   */
  requestPasswordReset(dto: PasswordResetRequestDTO): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('auth/password/reset/request', dto);
  }

  /**
   * Confirma a troca de senha via token recebido por e-mail.
   */
  confirmPasswordReset(dto: PasswordResetConfirmDTO): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('auth/password/reset/confirm', dto);
  }

  changePassword(dto: ChangePasswordDTO): Observable<void> {
    return this.api.put<void>('auth/password', dto);
  }

  requestEmailChange(dto: EmailChangeRequestDTO): Observable<{ token: string }> {
    return this.api.post<{ token: string }>('auth/email/request-change', dto);
  }

  confirmEmailChange(dto: EmailConfirmDTO): Observable<void> {
    return this.api.post<void>('auth/email/confirm', dto);
  }

  private handleAuthResponse(response: AccessTokenResponse): void {
    this.tokenService.setToken(response.accessToken);
    this._isLoggedInSignal.set(true);
  }
}