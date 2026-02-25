import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '@services/auth';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CreatePollModalComponent } from '@components/create-poll-modal/create-poll-modal';
import { Poll, PollService } from '@services/poll';
import { LogoComponent } from '@components/logo/logo';
import { SettingsModalComponent } from '@components/settings-modal/settings-modal';
import { SearchModalComponent } from '@components/search-modal/search-modal';
import { NotificationsModalComponent } from "@components/notifications-modal/notifications-modal";
import { NotificationService } from '@services/notification';

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
  user = this.auth.user;
  notificationService = inject(NotificationService);

  @ViewChild('createModal') createModal!: CreatePollModalComponent;
  @ViewChild('settingsModal') settingsModal!: SettingsModalComponent;
  @ViewChild('searchModal') searchModal!: SearchModalComponent;
  @ViewChild('notificationsModal') notificationsModal!: NotificationsModalComponent;

  currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'pt-BR';
  }

  trending = [
    { rank: 1, question: 'Qual framework frontend você usa?', votes: 93 },
    { rank: 2, question: 'Melhor jogo de 2024?', votes: 104 },
    { rank: 3, question: 'Café ou energético?', votes: 111 },
  ];
  activities = [
    { name: 'Ana Lima', initials: 'AL', color: 'linear-gradient(135deg,#5B8DF7,#9B79F5)', text: 'votou em React', time: '1min' },
    { name: 'Pedro H.', initials: 'PH', color: 'linear-gradient(135deg,#F06292,#FF8A65)', text: 'criou uma nova enquete', time: '5min' },
  ];

  openCreateModal() {
    this.createModal.open();
  }

  openSearch() {
    this.searchModal.open();
  }

  openNotifications() {
    this.notificationsModal.open();
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  onCreatePoll(event: { question: string; options: string[]; category: string }): void {
    const newPoll: Poll = {
      id: Date.now(),
      author: this.user()?.name || 'Você',
      initials: this.user()?.initials || '??',
      color: 'linear-gradient(135deg,#5B8DF7,#9B79F5)',
      question: event.question,
      category: event.category,
      options: event.options.map(text => ({ text, votes: 0 })),
      live: true,
      time: 'agora mesmo',
      mine: true,
      voted: 0,
    };
    this.pollService.addPoll(newPoll);
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