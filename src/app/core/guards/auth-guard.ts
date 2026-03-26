import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth';
import { UserService } from '@services/user';
import { FeedSseService } from '@sse/feed-sse';
import { map, catchError, tap, retry } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificationSseService } from '@sse/notification-sse';

export const authGuard: CanActivateFn = (_, state) => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const feedSse = inject(FeedSseService);
  const notificationSse = inject(NotificationSseService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    feedSse.connect();
    notificationSse.connect();
    userService.loadUserProfile();
    return true;
  }

  return authService.refreshToken().pipe(
    tap(
      {
        next: (res) => console.log('[authGuard] refresh OK', res),
        error: (err) => console.error('[authGuard] refresh FALHOU', err.status, err.error)
      }),
    retry({ count: 1, delay: 1000 }),
    map(() => true),
    tap(() => {
      feedSse.connect();
      notificationSse.connect();
      userService.loadUserProfile();
    }),
    catchError(() => of(router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    })))
  );
};