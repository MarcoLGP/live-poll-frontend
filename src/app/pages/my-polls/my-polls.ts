import { Component, inject } from '@angular/core';
import { PollService, Poll } from '@services/poll';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-my-polls',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe],
  templateUrl: './my-polls.html',
  styleUrls: ['./my-polls.scss']
})
export class MyPollsComponent {
  pollService = inject(PollService);
  polls = this.pollService.polls; 

  get myPolls(): Poll[] {
    return this.polls().filter(p => p.mine);
  }

  get hasNoPolls(): boolean {
    return this.myPolls.length === 0;
  }

  getTotalVotes(poll: Poll): number {
    return poll.options.reduce((s, o) => s + o.votes, 0);
  }

  getCategoryStyle(category: string): { bg: string; c: string } {
    const map: Record<string, { bg: string; c: string }> = {
      '💻 Tecnologia': { bg: 'rgba(91,141,247,.12)', c: '#5B8DF7' },
      '🎮 Games':      { bg: 'rgba(155,121,245,.12)', c: '#9B79F5' },
      '🎵 Música':     { bg: 'rgba(240,98,146,.12)',  c: '#F06292' },
      '🏀 Esportes':   { bg: 'rgba(82,217,160,.12)',  c: '#52D9A0' },
      '🍕 Comida':     { bg: 'rgba(245,179,66,.12)',  c: '#F5B342' },
      '💬 Geral':      { bg: 'rgba(255,255,255,.06)', c: '#8892B0' },
    };
    return map[category] || map['💬 Geral'];
  }

  calculatePercentage(part: number, total: number): number {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  }

  togglePollStatus(poll: Poll) {
    poll.live = !poll.live;
  }

  deletePoll(pollId: number) {
    // Implementar exclusão
  }

  copyLink(pollId: number) {
    // Implementar cópia de link
  }
}