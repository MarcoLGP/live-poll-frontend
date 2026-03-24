import { Component, inject, signal, HostListener, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LogoComponent } from '@components/logo/logo';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TranslatePipe, LogoComponent],
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.scss']
})
export class PublicLayoutComponent {
  private platformId = inject(PLATFORM_ID);

  currentLang: string;

  drawerOpen = signal(false);

 constructor(public translate: TranslateService) {
  this.currentLang = localStorage.getItem('lang') || 'pt-BR';

  this.translate.onLangChange.subscribe(event => {
    this.currentLang = event.lang;
  });
}

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
  }

  toggleDrawer(): void {
    this.drawerOpen.update(v => !v);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.drawerOpen() ? 'hidden' : '';
    }
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (isPlatformBrowser(this.platformId) && window.innerWidth >= 768) {
      this.closeDrawer();
    }
  }
}