import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Poll } from '@services/poll';

@Component({
  selector: 'app-poll-card',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe],
  templateUrl: './poll-card.html',
  styleUrls: ['./poll-card.scss']
})
export class PollCardComponent {
  poll = input.required<Poll>();
  vote = output<number>(); 

  private categoryStyles: Record<string, { bg: string; c: string }> = {
    '💻 Tecnologia': { bg: 'rgba(91,141,247,.12)', c: '#5B8DF7' },
    '🎮 Games':      { bg: 'rgba(155,121,245,.12)', c: '#9B79F5' },
    '🎵 Música':     { bg: 'rgba(240,98,146,.12)',  c: '#F06292' },
    '🏀 Esportes':   { bg: 'rgba(82,217,160,.12)',  c: '#52D9A0' },
    '🍕 Comida':     { bg: 'rgba(245,179,66,.12)',  c: '#F5B342' },
    '💬 Geral':      { bg: 'rgba(255,255,255,.06)', c: '#8892B0' },
  };

  getCategoryStyle(category: string): { bg: string; c: string } {
    return this.categoryStyles[category] || this.categoryStyles['💬 Geral'];
  }

  getTotalVotes(): number {
    return this.poll().options.reduce((sum, opt) => sum + opt.votes, 0);
  }

  calculatePercentage(part: number): number {
    const total = this.getTotalVotes();
    return total > 0 ? Math.round((part / total) * 100) : 0;
  }
}