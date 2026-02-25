import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth';
import { AppInitService } from '@services/app-init';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const appInit = inject(AppInitService);

  return toObservable(appInit.isInitialized).pipe(
    filter(initialized => initialized === true),
    take(1),
    map(() => {
      console.log(authService)
      if (authService.isLoggedIn()) {
        return true;
      }
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    })
  );
};