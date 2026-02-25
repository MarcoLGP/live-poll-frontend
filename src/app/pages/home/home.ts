import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { Poll, PollService } from '@services/poll';
import { AuthService } from '@services/auth';
import { ToastService } from '@services/toast';
import { ConfettiService } from '@services/confetti';

import { FooterComponent } from '@components/footer/footer';
import { ToastComponent } from '@components/toast/toast';
import { ConfettiComponent } from '@components/confetti/confetti';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    ToastComponent,
    ConfettiComponent,
    TranslatePipe,
    DecimalPipe,
    FormsModule,
    RouterLink
],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  private pollService = inject(PollService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private confettiService = inject(ConfettiService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  polls = this.pollService.polls;

  // ========== MÉTODOS AUXILIARES ==========
  getTotalVotes(poll: Poll): number {
    return poll.options.reduce((acc, o) => acc + o.votes, 0);
  }

  getWinnerIndex(poll: Poll): number {
    let max = -1, idx = 0;
    poll.options.forEach((o, i) => {
      if (o.votes > max) {
        max = o.votes;
        idx = i;
      }
    });
    return max > 0 ? idx : -1;
  }

  getPct(votes: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora mesmo';
    if (mins < 60) return `${mins}min atrás`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h atrás`;
    return `${Math.floor(hrs / 24)}d atrás`;
  }

  catClass(cat: string): string {
    const map: Record<string, string> = { tech: 'cat-tech', life: 'cat-life', general: 'cat-general' };
    return map[cat] || 'cat-custom';
  }

  catLabel(cat: string): string {
    const map: Record<string, string> = { tech: 'Tecnologia', life: 'Estilo de Vida', general: 'Geral' };
    return map[cat] || cat;
  }

  // ========== SCROLL ==========
  scrollToPolls() {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById('polls-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // ========== VOTAÇÃO ==========
  vote(poll: Poll, optionIndex: number, event: MouseEvent) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    if (poll.voted !== null) return;

    this.createRipple(event);
    this.pollService.vote(poll.id, optionIndex);

    if (isPlatformBrowser(this.platformId)) {
      const card = (event.target as HTMLElement).closest('.poll-card');
      if (card) {
        const rect = card.getBoundingClientRect();
        this.confettiService.launch(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }

    this.toastService.show('success', '🎉', 'Voto registrado!', 'Seu voto foi contabilizado.');
  }

  createRipple(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${event.clientX - rect.left - size / 2}px;
      top: ${event.clientY - rect.top - size / 2}px;
    `;
    target.style.position = 'relative';
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }  
}