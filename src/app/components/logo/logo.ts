import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a class="logo" [routerLink]="link">
      <svg class="logo-mark" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#7C6FF7" />
            <stop offset="100%" stop-color="#A78BFA" />
          </linearGradient>
          <linearGradient id="lg2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#F59E0B" />
            <stop offset="100%" stop-color="#F59E0B" stop-opacity="0.6" />
          </linearGradient>
        </defs>
        <!-- Outer ring -->
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="url(#lg1)"
          stroke-width="2"
          fill="none"
          stroke-dasharray="4 2"
          opacity="0.5"
        />
        <!-- Poll bars -->
        <rect x="10" y="22" width="5" height="7" rx="2" fill="url(#lg1)" />
        <rect x="17" y="16" width="5" height="13" rx="2" fill="url(#lg1)" opacity="0.8" />
        <rect x="24" y="12" width="2" height="17" rx="1" fill="url(#lg2)" />
        <!-- Dot -->
        <circle cx="25" cy="10" r="3" fill="url(#lg2)" />
        <circle cx="25" cy="10" r="1.5" fill="white" opacity="0.8" />
      </svg>
      <span class="logo-text">LivePoll<span>!</span></span>
    </a>
  `,
  styles: [
    `
      .logo {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
      }

      .logo-mark {
        width: 36px;
        height: 36px;
      }

      .logo-text {
        font-family: 'Fraunces', serif;
        font-size: 26px;
        font-weight: 700;
        letter-spacing: -0.5px;
        background: linear-gradient(135deg, var(--txt) 40%, #7c6ff7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .logo-text span {
        background: linear-gradient(135deg, #f59e0b, #f59e0b 80%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    `,
  ],
})
export class LogoComponent {
  @Input() link: string = '/';
}