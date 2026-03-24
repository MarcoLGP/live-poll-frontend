import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '@services/auth';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CreatePollModalComponent } from '@components/create-poll-modal/create-poll-modal';
import { PollService } from '@services/poll';
import { LogoComponent } from '@components/logo/logo';
import { SettingsModalComponent } from '@components/settings-modal/settings-modal';
import { SearchModalComponent } from '@components/search-modal/search-modal';
import { NotificationsModalComponent } from "@components/notifications-modal/notifications-modal";
import { NotificationService } from '@services/notification';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { UserService } from '@services/user';
import { filter } from 'rxjs';
import { MyPollsService } from '@services/my-polls';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent, RouterOutlet, TranslatePipe, CreatePollModalComponent, SettingsModalComponent, SearchModalComponent, NotificationsModalComponent],
  templateUrl: './private-layout.html',
  styleUrls: ['./private-layout.scss']
})
export class PrivateLayoutComponent {
  pollService = inject(PollService);
  auth = inject(AuthService);
  router = inject(Router);
  notificationService = inject(NotificationService);
  user = inject(UserService).user;

get myUnreadCount(): number {
  return this.notificationService.unreadCount();
}

  @ViewChild('createModal') createModal!: CreatePollModalComponent;
  @ViewChild('settingsModal') settingsModal!: SettingsModalComponent;
  @ViewChild('searchModal') searchModal!: SearchModalComponent;
  @ViewChild('notificationsModal') notificationsModal!: NotificationsModalComponent;

  private readonly destroyRef = inject(DestroyRef);

  currentLang: string;

  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.getCurrentLang() || 'pt-BR';
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.closeMobileMenu());
  }

  closeMobileMenu(): void {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

get recentNotifications() {
  return this.notificationService.notifications().slice(0, 4);
}

  openCreateModal() {
    this.createModal.open();
  }

  openSearch() {
    this.searchModal.open();
  }

  openNotifications() {
    this.notificationsModal.open();
  }

  getAvatarBackground(avatarUrl?: string, gradientAvatar?: string): string {
    if (avatarUrl) {
      return 'none';
    }
    return gradientAvatar || 'linear-gradient(135deg, var(--primary), var(--primary-2))';
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
  }

  onSettingsClosed() {
    // Handle any actions needed after settings modal is closed
  }

  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToSettings() {
    this.settingsModal.open();
    this.isOpen = false;
  }
}