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

export interface User {
  name: string;
  handle: string;
  initials: string;
  pollsCreated: number;
  votesReceived: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private _isLoggedInSignal = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedInSignal.asReadonly();

  private userSignal = signal<User>({
    name: 'João Demo',
    handle: 'joaodemo',
    initials: 'JD',
    pollsCreated: 3,
    votesReceived: 127
  });
  readonly user = this.userSignal.asReadonly();

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

  logout(): void {
    this.tokenService.clearToken();
    this._isLoggedInSignal.set(false);
    this.router.navigate(['/login']);

    this.api.post('auth/logout', {}).subscribe({
      error: (err) => console.error('Erro ao fazer logout no backend', err)
    });
  }

  private handleAuthResponse(response: AccessTokenResponse): void {
    this.tokenService.setToken(response.accessToken);
    this._isLoggedInSignal.set(true);
  }
}