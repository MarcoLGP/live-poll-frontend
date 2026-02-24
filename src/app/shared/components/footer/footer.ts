import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <footer>
      <div class="footer-logo">LivePoll<span>!</span></div>
      <div>{{ 'FOOTER.MADE_WITH' | translate }}</div>
    </footer>
  `,
  styles: [`
    footer {
      position: relative;
      z-index: 1;
      border-top: 1px solid var(--border);
      padding: 32px 24px;
      text-align: center;
      color: var(--txt3);
      font-size: 13px;
    }
    footer .footer-logo {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 18px;
      color: var(--txt2);
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    footer .footer-logo span {
      background: linear-gradient(135deg, var(--primary), var(--primary-2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `]
})
export class FooterComponent {}