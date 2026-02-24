import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from '@shared/components/footer/footer';
import { ToastComponent } from '@shared/components/toast/toast';
import { ConfettiComponent } from '@shared/components/confetti/confetti';

import { Poll } from '@models/poll.model';
import { PollService } from '@services/poll';
import { AuthService } from '@services/auth';
import { ToastService } from '@services/toast';
import { ConfettiService } from '@services/confetti';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    ToastComponent,
    ConfettiComponent,
    TranslatePipe,
    DecimalPipe,        
    FormsModule        
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
  isModalOpen = false;

  // Para o modal de criação
  newPollQuestion = '';
  newPollCategory: 'tech' | 'life' | 'general' = 'general';
  newPollOptions: string[] = ['', ''];

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

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
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
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    if (poll.voted) return;

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

  // ========== MODAL ==========
  openModal() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.isModalOpen = true;
    this.resetModal();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  closeModalOnBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  resetModal() {
    this.newPollQuestion = '';
    this.newPollCategory = 'general';
    this.newPollOptions = ['', ''];
  }

  addOption() {
    if (this.newPollOptions.length >= 6) {
      this.toastService.show('info', '⚠️', 'Máximo atingido', 'Você pode ter no máximo 6 opções.');
      return;
    }
    this.newPollOptions.push('');
  }

  removeOption(index: number) {
    if (this.newPollOptions.length <= 2) return;
    this.newPollOptions.splice(index, 1);
  }

  createPoll() {
    const question = this.newPollQuestion.trim();
    const options = this.newPollOptions.map(o => o.trim()).filter(o => o.length > 0);

    if (!question) {
      this.toastService.show('info', '⚡', 'Pergunta vazia', 'Escreva uma pergunta para sua enquete.');
      return;
    }
    if (options.length < 2) {
      this.toastService.show('info', '⚡', 'Poucas opções', 'Adicione pelo menos 2 opções de resposta.');
      return;
    }

    const newPoll: Poll = {
      id: Date.now(),
      question,
      category: this.newPollCategory,
      options: options.map(text => ({ text, votes: 0 })),
      voted: false,
      votedIndex: null,
      createdAt: Date.now(),
      isNew: true
    };

    this.pollService.addPoll(newPoll);
    this.closeModal();
    this.toastService.show('success', '🚀', 'Enquete publicada!', 'Sua enquete está ao vivo no mural.');

    setTimeout(() => {
      const p = this.pollService.polls().find(p => p.id === newPoll.id);
      if (p) p.isNew = false;
    }, 1000);

    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        document.getElementById('polls-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  }
}