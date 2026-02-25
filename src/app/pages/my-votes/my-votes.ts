import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { PollService, Poll } from '@services/poll';
import { RelativeTimePipe } from '@shared/pipes/relative-time-pipe';
import { categoryMap } from '@shared/constants/categories';

@Component({
  selector: 'app-my-votes',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe, RelativeTimePipe],
  templateUrl: './my-votes.html',
  styleUrls: ['./my-votes.scss']
})
export class MyVotesComponent {
  private pollService = inject(PollService);
  polls = this.pollService.polls;

  get votedPolls(): Poll[] {
    return this.polls().filter(p => p.voted !== null);
  }

  getTotalVotes(poll: Poll): number {
    return poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  }

  calculatePercentage(votes: number, total: number): number {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  }

  getCategoryInfo(categoryKey: string) {
    return categoryMap.get(categoryKey);
  }
}