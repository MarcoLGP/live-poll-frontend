import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  group: 'Hoje' | 'Ontem' | 'Esta semana' | 'Anterior';
  type: 'vote' | 'create' | 'trend' | 'mile' | 'expire' | 'system';
  unread: boolean;
  icon: string; 
  avatarInitials: string | null;
  avatarColor: string | null;
  text: string;
  poll: string | null;
  time: string;
  category: 'votes' | 'system';
  progress?: number;
  progressMax?: number;
  milestone?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSignal = signal<Notification[]>(MOCK_NOTIFICATIONS);
  readonly notifications = this.notificationsSignal.asReadonly();

  readonly unreadCount = signal(this.notificationsSignal().filter(n => n.unread).length);

  markAsRead(id: number) {
    this.notificationsSignal.update(notifs =>
      notifs.map(n => n.id === id ? { ...n, unread: false } : n)
    );
    this.updateUnreadCount();
  }

  markAllAsRead() {
    this.notificationsSignal.update(notifs =>
      notifs.map(n => ({ ...n, unread: false }))
    );
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    this.unreadCount.set(this.notificationsSignal().filter(n => n.unread).length);
  }
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    group: 'Hoje',
    type: 'vote',
    unread: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    avatarInitials: 'AL',
    avatarColor: 'linear-gradient(135deg,#F06292,#FF8A65)',
    text: '<strong>Ana Lima</strong> votou em <strong>React</strong> na sua enquete',
    poll: 'Qual framework frontend você usa no dia a dia?',
    time: 'Agora mesmo',
    category: 'votes',
  },
  {
    id: 2,
    group: 'Hoje',
    type: 'vote',
    unread: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    avatarInitials: 'PH',
    avatarColor: 'linear-gradient(135deg,#52D9A0,#5B8DF7)',
    text: '<strong>Pedro H.</strong> votou em <strong>macOS</strong> na sua enquete',
    poll: 'Linux, macOS ou Windows para desenvolvimento?',
    time: '5 min atrás',
    category: 'votes',
  },
  {
    id: 3,
    group: 'Hoje',
    type: 'mile',
    unread: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    avatarInitials: null,
    avatarColor: null,
    text: 'Sua enquete atingiu <strong>100 votos</strong>! 🎉',
    poll: 'Linux, macOS ou Windows para desenvolvimento?',
    time: '18 min atrás',
    category: 'system',
    progress: 100,
    progressMax: 100,
    milestone: '100 votos',
  },
  {
    id: 4,
    group: 'Hoje',
    type: 'trend',
    unread: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    avatarInitials: null,
    avatarColor: null,
    text: 'Sua enquete está <strong>em alta</strong> e aparecendo nos destaques 🔥',
    poll: 'Qual framework frontend você usa no dia a dia?',
    time: '42 min atrás',
    category: 'system',
  },
  {
    id: 5,
    group: 'Hoje',
    type: 'vote',
    unread: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    avatarInitials: 'LC',
    avatarColor: 'linear-gradient(135deg,#F5B342,#F06292)',
    text: '<strong>Laura C.</strong> votou em <strong>Vue.js</strong> na sua enquete',
    poll: 'Qual framework frontend você usa no dia a dia?',
    time: '1h atrás',
    category: 'votes',
  },
  {
    id: 6,
    group: 'Hoje',
    type: 'vote',
    unread: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    avatarInitials: 'GS',
    avatarColor: 'linear-gradient(135deg,#9B79F5,#52D9A0)',
    text: '<strong>Gabriel S.</strong> e <strong>+4 pessoas</strong> votaram na sua enquete',
    poll: 'Linux, macOS ou Windows para desenvolvimento?',
    time: '2h atrás',
    category: 'votes',
  },
  {
    id: 7,
    group: 'Ontem',
    type: 'expire',
    unread: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    avatarInitials: null,
    avatarColor: null,
    text: 'Sua enquete <strong>encerra em 2 horas</strong>. Compartilhe para mais votos!',
    poll: 'Café ou energético para trabalhar à noite?',
    time: 'Ontem, 22:14',
    category: 'system',
  },
];