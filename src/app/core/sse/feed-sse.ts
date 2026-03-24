import { Injectable, signal, OnDestroy, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { SseClient } from 'ngx-sse-client';
import { Subject, Subscription } from 'rxjs';

import { environment } from '@env/environment';
import { TokenService } from '@services/token-service';
import { PollReadFeed } from '@models/poll.model';

export type SseEventType =
  | 'POLL_CREATED'
  | 'POLL_UPDATED'
  | 'POLL_DELETED'
  | 'OPTION_REMOVED'
  | 'VOTE_UPDATED';

export interface SseEvent<T = any> {
  type: SseEventType;
  payload: T;
}

@Injectable({ providedIn: 'root' })
export class FeedSseService implements OnDestroy {
  private readonly sseClient = inject(SseClient);
  private readonly tokenService = inject(TokenService);
  private eventSubject = new Subject<SseEvent>();
  events$ = this.eventSubject.asObservable();

  private sseSubscription: Subscription | null = null;
  readonly polls = signal<PollReadFeed[]>([]);

  connect(): void {
    if (this.sseSubscription) return;

    const token = this.tokenService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.apiBaseUrl}/stream/feed`;

    this.sseSubscription = this.sseClient
      .stream(url, { keepAlive: true, reconnectionDelay: 3000, responseType: 'event' }, { headers }, 'GET')
      .subscribe({
        next: (event) => {
          if (event instanceof MessageEvent) {
            try {
              const sseEvent = JSON.parse(event.data) as SseEvent;
              this.eventSubject.next(sseEvent);
            } catch (e) {
              console.error('Erro ao parsear evento SSE', e);
            }
          }
        },
        error: (err) => {
          console.error('Erro fatal na stream SSE', err);
          this.disconnect();
        },
        complete: () => {
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