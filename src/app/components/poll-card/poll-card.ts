import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Poll } from '@services/poll';
import { categoryMap, Category } from '@shared/constants/categories';
import { RelativeTimePipe } from '@shared/pipes/relative-time-pipe';

@Component({
  selector: 'app-poll-card',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe, RelativeTimePipe],
  templateUrl: './poll-card.html',
  styleUrls: ['./poll-card.scss']
})
export class PollCardComponent {
  poll = input.required<Poll>();
  vote = output<number>();

  getCategoryStyle(categoryKey: string): { bg: string; c: string } {
    const cat = categoryMap.get(categoryKey);
    return cat ? { bg: cat.bg, c: cat.c } : { bg: 'rgba(255,255,255,.06)', c: '#8892B0' };
  }

  getCategoryInfo(categoryKey: string): Category | undefined {
    return categoryMap.get(categoryKey);
  }

  getTotalVotes(): number {
    return this.poll().options.reduce((sum, opt) => sum + opt.votes, 0);
  }

  calculatePercentage(part: number): number {
    const total = this.getTotalVotes();
    return total > 0 ? Math.round((part / total) * 100) : 0;
  }
}