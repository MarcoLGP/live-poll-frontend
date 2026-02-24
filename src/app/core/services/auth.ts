import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './baseApi';
import { TokenService } from './token-service';

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  usernameOrEmail: string;
  password: string;
}

export interface AccessTokenResponse {
  accessToken: string;
  tokenType: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private _isLoggedInSignal = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedInSignal.asReadonly();

  constructor() {
    this.refreshToken().subscribe({
      next: () => console.log('Sessão restaurada'),
      error: () => console.log('Nenhuma sessão ativa')
    });
  }

  register(dto: RegisterDTO): Observable<AccessTokenResponse> {
    return this.api.post<AccessTokenResponse>('auth/register', dto).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  login(dto: LoginDTO): Observable<AccessTokenResponse> {
    return this.api.post<AccessTokenResponse>('auth/login', dto).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  refreshToken(): Observable<AccessTokenResponse> {
    return this.api.post<AccessTokenResponse>('auth/refresh', {}).pipe(
      tap(response => this.handleAuthResponse(response)),
    );
  }

  public isAuthenticated(): boolean {
    return this.tokenService.getToken() !== null;
  }

  logout(): void {
    this.api.post('auth/logout', {}).subscribe({
      complete: () => {
        this.tokenService.clearToken();
        this._isLoggedInSignal.set(false);
        this.router.navigate(['/login']);
      }
    });
  }

  private handleAuthResponse(response: AccessTokenResponse): void {
    this.tokenService.setToken(response.accessToken);
    this._isLoggedInSignal.set(true);
  }
}