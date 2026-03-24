import { Component, inject, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NotificationService } from '@services/notification';
import { Notification } from '@models/notification.model';
import { CommonModule } from '@angular/common';

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
  readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  open() { this.isOpen.set(true); }

  closeModal() {
    this.isOpen.set(false);
    this.close.emit();
  }

onNotificationClick(notif: Notification) {
  if (notif.referenceId) {
    this.closeModal();
    this.router.navigate(['/poll'], { queryParams: { id: notif.referenceId } });
  }
}

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) this.closeModal();
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  onNotificationHover(notif: Notification) {
  if (!notif.read) {
    this.notificationService.markAsRead(notif.id);
  }
}

  getGroupedNotifications() {
    const groups: { [key: string]: Notification[] } = {};
    this.notificationService.notifications().forEach(n => {
      if (!groups[n.group]) groups[n.group] = [];
      groups[n.group].push(n);
    });
    return groups;
  }
}