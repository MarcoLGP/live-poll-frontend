import { Injectable, inject, OnDestroy } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { SseClient } from 'ngx-sse-client';
import { Subject, Subscription } from 'rxjs';
import { environment } from '@env/environment';
import { TokenService } from '@services/token-service';
import { NotificationDTO } from '@models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationSseService implements OnDestroy {
  private readonly sseClient = inject(SseClient);
  private readonly tokenService = inject(TokenService);

  private eventSubject = new Subject<NotificationDTO>();
  events$ = this.eventSubject.asObservable();

  private sseSubscription: Subscription | null = null;

  connect(): void {
    if (this.sseSubscription) return;

    const token = this.tokenService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.apiBaseUrl}/stream/notifications`;

    this.sseSubscription = this.sseClient
      .stream(
        url,
        {
          keepAlive: true,
          reconnectionDelay: 3000,
          responseType: 'event',
        },
        { headers },
        'GET'
      )
      .subscribe({
        next: (event) => {
          if (event instanceof MessageEvent) {
            try {
              const notification = JSON.parse(event.data) as NotificationDTO;
              this.eventSubject.next(notification);
            } catch (e) {
              console.error('Erro ao parsear notificação SSE', e);
            }
          } else if (event instanceof ErrorEvent) {
            console.error('Erro na conexão SSE de notificações', event.error, event.message);
          } else {
            console.warn('Evento SSE de notificações desconhecido', event);
          }
        },
        error: (err) => {
          console.error('Erro fatal na stream SSE de notificações', err);
          this.disconnect();
        },
        complete: () => {
          console.log('Stream SSE de notificações encerrada');
          this.sseSubscription = null;
        }
      });
  }

  disconnect(): void {
    this.sseSubscription?.unsubscribe();
    this.sseSubscription = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}