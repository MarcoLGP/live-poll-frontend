import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './base-api';
import { Observable, tap } from 'rxjs';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  gradientAvatar?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDTO {
  username: string;
  gradientAvatar?: string | null;
  avatarUrl?: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  private userSignal = signal<UserProfile | null>(null);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  loadUserProfile(): void {
    if (this.loadingSignal()) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.get<UserProfile>('user/me').subscribe({
      next: (userData) => {
        this.userSignal.set(userData);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('Erro ao carregar perfil. Tente novamente.');
        this.loadingSignal.set(false);
      }
    });
  }

  updateProfile(dto: UpdateProfileDTO): Observable<UserProfile> {
    return this.api.put<UserProfile>('user', dto).pipe(
      tap(updated => {
        this.userSignal.update(current => {
          if (current) {
            return { ...current, ...updated };
          }
          return updated;
        });
      })
    );
  }

  deleteAccount(): Observable<void> {
    return this.api.delete<void>('user');
  }
}