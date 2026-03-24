import { Component, inject, PLATFORM_ID, OnInit, signal, OnDestroy } from '@angular/core';
import { isPlatformBrowser, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '@services/auth';
import { ToastService } from '@services/toast';
import { ConfettiService } from '@services/confetti';

import { FooterComponent } from '@components/footer/footer';
import { ToastComponent } from '@components/toast/toast';
import { ConfettiComponent } from '@components/confetti/confetti';
import { Poll } from '@models/poll.model';

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
export class HomeComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private confettiService = inject(ConfettiService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService);

  private langChangeSubscription?: Subscription;

  polls = signal<Poll[]>([]);

  ngOnInit() {
    this.loadMockPolls();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadMockPolls();
    });
  }

  ngOnDestroy() {
    this.langChangeSubscription?.unsubscribe();
  }

  private loadMockPolls() {
    const polls = this.generateMockPolls();
    this.polls.set(polls);
  }

  private generateMockPolls(): Poll[] {
    const now = new Date();
    return [
      {
        id: -1,
        authorName: this.translate.instant('MOCK_POLLS.AUTHOR_NAME_1') || 'Visitante',
        authorAvatarUrl: null,
        authorGradient: 'blue',
        title: this.translate.instant('MOCK_POLLS.TITLE_1'),
        authorId: -1,
        category: 'tech',
        active: true,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        myVotedOptionId: null,
        totalVotes: 42,
        options: [
          { id: -11, text: this.translate.instant('MOCK_POLLS.OPTION_1_1'), votes: 18, percentage: 43, displayOrder: 0 },
          { id: -12, text: this.translate.instant('MOCK_POLLS.OPTION_1_2'), votes: 15, percentage: 36, displayOrder: 1 },
          { id: -13, text: this.translate.instant('MOCK_POLLS.OPTION_1_3'), votes: 5, percentage: 12, displayOrder: 2 },
          { id: -14, text: this.translate.instant('MOCK_POLLS.OPTION_1_4'), votes: 4, percentage: 9, displayOrder: 3 }
        ]
      },
      {
        id: -2,
        authorName: this.translate.instant('MOCK_POLLS.AUTHOR_NAME_2') || 'Usuário Demo',
        authorAvatarUrl: null,
        authorGradient: 'green',
        title: this.translate.instant('MOCK_POLLS.TITLE_2'),
        authorId: -2,
        category: 'general',
        active: true,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        myVotedOptionId: null,
        totalVotes: 128,
        options: [
          { id: -21, text: this.translate.instant('MOCK_POLLS.OPTION_2_1'), votes: 72, percentage: 56, displayOrder: 0 },
          { id: -22, text: this.translate.instant('MOCK_POLLS.OPTION_2_2'), votes: 38, percentage: 30, displayOrder: 1 },
          { id: -23, text: this.translate.instant('MOCK_POLLS.OPTION_2_3'), votes: 12, percentage: 9, displayOrder: 2 },
          { id: -24, text: this.translate.instant('MOCK_POLLS.OPTION_2_4'), votes: 6, percentage: 5, displayOrder: 3 }
        ]
      },
      {
        id: -3,
        authorName: this.translate.instant('MOCK_POLLS.AUTHOR_NAME_3') || 'Explorador',
        authorAvatarUrl: null,
        authorGradient: 'orange',
        title: this.translate.instant('MOCK_POLLS.TITLE_3'),
        authorId: -3,
        category: 'music',
        active: true,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        myVotedOptionId: null,
        totalVotes: 87,
        options: [
          { id: -31, text: this.translate.instant('MOCK_POLLS.OPTION_3_1'), votes: 34, percentage: 39, displayOrder: 0 },
          { id: -32, text: this.translate.instant('MOCK_POLLS.OPTION_3_2'), votes: 28, percentage: 32, displayOrder: 1 },
          { id: -33, text: this.translate.instant('MOCK_POLLS.OPTION_3_3'), votes: 15, percentage: 17, displayOrder: 2 },
          { id: -34, text: this.translate.instant('MOCK_POLLS.OPTION_3_4'), votes: 10, percentage: 12, displayOrder: 3 }
        ]
      }
    ];
  }

  // ========== MÉTODOS AUXILIARES ==========
  getTotalVotes(poll: Poll): number {
    return poll.totalVotes;
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
  async vote(event: MouseEvent) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/register'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.createRipple(event);
    if (isPlatformBrowser(this.platformId)) {
      const card = (event.target as HTMLElement).closest('.poll-card');
      if (card) {
        const rect = card.getBoundingClientRect();
        this.confettiService.launch(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }
    this.toastService.show('info',
      this.translate.instant('TOAST.LOGIN_REQUIRED_TITLE'),
      this.translate.instant('TOAST.LOGIN_REQUIRED_DESC')
    );
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