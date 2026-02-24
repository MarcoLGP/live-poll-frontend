import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { PollService } from '@services/poll';

@Component({
  selector: 'app-my-votes',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe],
  templateUrl: './my-votes.html',
  styleUrls: ['./my-votes.scss']
})
export class MyVotesComponent {
  private pollService = inject(PollService);
  polls = this.pollService.polls; 

  get votedPolls() {
    return this.polls().filter(p => p.voted !== null);
  }

  getTotalVotes(poll: any): number {
    return poll.options.reduce((sum: number, opt: any) => sum + opt.votes, 0);
  }

  calculatePercentage(votes: number, total: number): number {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  }

  getCategoryStyle(category: string): { bg: string; c: string } {
    const map: Record<string, { bg: string; c: string }> = {
      '💻 Tecnologia': { bg: 'rgba(124,111,247,.12)', c: 'var(--primary)' },
      '🎮 Games':      { bg: 'rgba(155,121,245,.12)', c: 'var(--primary-2)' },
      '🎵 Música':     { bg: 'rgba(240,98,146,.12)',  c: 'var(--pink)' },
      '🏀 Esportes':   { bg: 'rgba(82,217,160,.12)',  c: 'var(--green)' },
      '🍕 Comida':     { bg: 'rgba(245,179,66,.12)',  c: 'var(--amber)' },
      '💬 Geral':      { bg: 'rgba(255,255,255,.06)', c: 'var(--txt2)' },
    };
    return map[category] || map['💬 Geral'];
  }
}