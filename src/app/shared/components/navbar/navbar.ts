import { Component, inject, Output, EventEmitter, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUser, heroLanguage } from '@ng-icons/heroicons/outline';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TranslatePipe, NgIconComponent],
  viewProviders: [provideIcons({ heroUser, heroLanguage })],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  private translate = inject(TranslateService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  @Output() createPollClick = new EventEmitter<void>();

  currentLang = this.translate.currentLang || 'pt-BR';

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  onCreatePoll() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    } else {
      this.createPollClick.emit();
    }
  }

  scrollToPolls() {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById('polls-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}