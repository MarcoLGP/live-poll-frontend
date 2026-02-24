import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { TokenService } from '@services/token-service';
import { AuthService } from '@services/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Não adiciona token para a requisição de refresh (evita loops)
    if (req.url.includes('/auth/refresh')) {
      console.log('Requisição de refresh detectada, não adicionando token');
      return next.handle(req);
    }

    let authReq = req;
    const token = this.tokenService.getToken();
    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          if (response?.accessToken) {
            this.refreshTokenSubject.next(response.accessToken);
            // Reexecuta a requisição original com o novo token
            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${response.accessToken}`)
            });
            return next.handle(newReq);
          } else {
            // Se não veio token, faz logout
            this.authService.logout();
            return throwError(() => new Error('Refresh token failed'));
          }
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout(); // Logout local e redireciona
          return throwError(() => err);
        })
      );
    } else {
      // Aguarda o novo token
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          const newReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(newReq);
        })
      );
    }
  }
}