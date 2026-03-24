import { Injectable, effect, inject, signal } from '@angular/core';
import { ApiService } from './base-api';
import { NotificationDTO, Notification } from '@models/notification.model';
import { UserService } from './user';
import { firstValueFrom } from 'rxjs';
import { NotificationSseService } from '@sse/notification-sse';
import { RelativeTimePipe } from '@shared/pipes/relative-time-pipe';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#5B8DF7,#9B79F5)',
  'linear-gradient(135deg,#F06292,#9B79F5)',
  'linear-gradient(135deg,#52D9A0,#5B8DF7)',
  'linear-gradient(135deg,#F5B342,#F06292)',
  'linear-gradient(135deg,#9B79F5,#F06292)',
  'linear-gradient(135deg,#52D9A0,#9B79F5)',
];

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = inject(ApiService);
  private userService = inject(UserService);
  private notificationSse = inject(NotificationSseService);
  private relativeTimePipe = new RelativeTimePipe();

  private notificationsSignal = signal<Notification[]>([]);
  readonly notifications = this.notificationsSignal.asReadonly();

  private unreadCountSignal = signal<number>(0);
  readonly unreadCount = this.unreadCountSignal.asReadonly();

  private currentPage = 0;
  private hasMore = true;
  private isLoading = false;

  constructor() {
    this.notificationSse.events$.subscribe((dto: NotificationDTO) => {
      this.addIncomingNotification(dto);
    });
    effect(() => {
      const user = this.userService.user();
      if (user) {
        this.loadInitialNotifications();
      }
    });
  }

  async loadInitialNotifications() {
    if (!this.userService.user()?.id) return;
    this.currentPage = 0;
    this.hasMore = true;
    this.notificationsSignal.set([]);
    await this.loadMore();
  }

  async loadMore() {
    if (this.isLoading || !this.hasMore) return;
    this.isLoading = true;
    try {
      const result = await firstValueFrom(
        this.api.get<{ content: NotificationDTO[]; hasNext: boolean }>(
          `/notifications?page=${this.currentPage}&size=25`
        )
      );
      if (!result?.content?.length) return;
      const enriched = result.content.map(dto => this.enrichNotification(dto));
      this.notificationsSignal.update(prev => [...prev, ...enriched]);
      this.hasMore = result.hasNext;
      this.currentPage++;
      this.updateUnreadCount();
    } catch (error) {
      console.error('Erro ao carregar notificações', error);
    } finally {
      this.isLoading = false;
    }
  }

  private enrichNotification(dto: NotificationDTO): Notification {
  const pollTitle = dto.referenceTitle || 'Enquete';
  const optionTitle = dto.subReferenceTitle;
  const group = this.getGroup(dto.createdAt);
  const time = this.relativeTimePipe.transform(dto.createdAt);

  const { textKey, textParams, progress, progressMax, milestone } = this.getNotificationContent(
    dto.type, pollTitle, dto.actorUsername, optionTitle
  );

  const avatarInitials = this.getInitials(dto.actorUsername);
  const avatarColor = AVATAR_GRADIENTS[Math.abs(dto.actorUserId) % AVATAR_GRADIENTS.length];

  return {
    id: dto.id,
    type: dto.type,
    read: dto.read,
    createdAt: dto.createdAt,
    referenceId: dto.referenceId,
    group,
    avatarInitials,
    avatarColor,
    textKey,     
    textParams, 
    pollTitle,
    optionTitle,
    actorName: dto.actorUsername,
    milestone,
    progress,
    progressMax,
    unread: !dto.read,
    time,
  };
}

  private getInitials(username: string): string {
    const parts = username.split(' ');
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }

  private getGroup(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);

    if (date.toDateString() === today.toDateString()) return 'NOTIFICATIONS.TODAY';
    if (date.toDateString() === yesterday.toDateString()) return 'NOTIFICATIONS.YESTERDAY';
    if (date > weekAgo) return 'NOTIFICATIONS.THIS_WEEK';
    return 'NOTIFICATIONS.EARLIER';
  }


  private getNotificationContent(
    type: string,
    pollTitle: string,
    actorName?: string,
    optionTitle?: string
  ): { textKey: string; textParams: Record<string, string>; progress?: number; progressMax?: number; milestone?: string } {
    switch (type) {
      case 'VOTE_RECEIVED':
        return actorName
          ? { textKey: 'NOTIFICATIONS.TEXT.VOTE_RECEIVED', textParams: { actor: actorName, poll: pollTitle } }
          : { textKey: 'NOTIFICATIONS.TEXT.VOTE_RECEIVED_ANON', textParams: { poll: pollTitle } };

      case 'POLL_MILESTONE':
        return {
          textKey: 'NOTIFICATIONS.TEXT.POLL_MILESTONE',
          textParams: { poll: pollTitle },
          progress: 100,
          progressMax: 100,
          milestone: '100',
        };

      case 'POLL_CLOSED':
        return {
          textKey: 'NOTIFICATIONS.TEXT.POLL_CLOSED',
          textParams: { poll: pollTitle },
        };

      default:
        return { textKey: 'NOTIFICATIONS.TEXT.VOTE_RECEIVED_ANON', textParams: { poll: pollTitle } };
    }
  }

  async markAllAsRead() {
    try {
      await firstValueFrom(this.api.put('/notifications/read-all', {}));
      this.notificationsSignal.update(notifs =>
        notifs.map(n => ({ ...n, read: true, unread: false })) // <-- atualiza unread
      );
      this.updateUnreadCount();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas', error);
    }
  }

  async markAsRead(id: number) {
    try {
      await firstValueFrom(this.api.put(`/notifications/${id}/read`, {}));
      this.notificationsSignal.update(notifs =>
        notifs.map(n => n.id === id ? { ...n, read: true, unread: false } : n)
      );
      this.updateUnreadCount();
    } catch (error) {
      console.error('Erro ao marcar como lida', error);
    }
  }

  private addIncomingNotification(dto: NotificationDTO) {
    const enriched = this.enrichNotification(dto);
    this.notificationsSignal.update(prev => [enriched, ...prev]);
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const count = this.notificationsSignal().filter(n => !n.read).length;
    this.unreadCountSignal.set(count);
  }
}