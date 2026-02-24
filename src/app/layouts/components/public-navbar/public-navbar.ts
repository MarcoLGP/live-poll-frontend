import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '@components/logo/logo';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LogoComponent],
  template: `
    <header class="public-navbar">
      <div class="nav-container">
        <app-logo></app-logo>
        <nav class="nav-links">
          <a routerLink="/login" class="btn-ghost">{{ 'NAV.LOGIN' | translate }}</a>
          <a routerLink="/register" class="btn-primary">{{ 'NAV.REGISTER' | translate }}</a>
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .public-navbar {
        position: sticky;
        top: 0;
        z-index: 100;
        background: rgba(7, 9, 15, 0.8);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid var(--border);
        padding: 0 32px;
        height: 64px;
        display: flex;
        align-items: center;
      }
      .nav-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1280px;
        margin: 0 auto;
      }
      .nav-links {
        display: flex;
        gap: 12px;
      }
    `,
  ],
})
export class PublicNavbarComponent {}