import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificationService } from '@services/notification';

@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './notifications-modal.html',
  styleUrls: ['./notifications-modal.scss']
})
export class NotificationsModalComponent {
  isOpen = signal(false);
  close = output<void>();

  constructor(public notificationService: NotificationService) {}

  open() {
    this.isOpen.set(true);
  }

  closeModal() {
    this.isOpen.set(false);
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  getGroupedNotifications() {
    const groups: { [key: string]: any[] } = {};
    this.notificationService.notifications().forEach(n => {
      if (!groups[n.group]) groups[n.group] = [];
      groups[n.group].push(n);
    });
    return groups;
  }

  translateGroup(group: string): string {
    const map: { [key: string]: string } = {
      'Hoje': 'NOTIFICATIONS.TODAY',
      'Ontem': 'NOTIFICATIONS.YESTERDAY',
      'Esta semana': 'NOTIFICATIONS.THIS_WEEK',
      'Anterior': 'NOTIFICATIONS.EARLIER'
    };
    return map[group] || group;
  }
}