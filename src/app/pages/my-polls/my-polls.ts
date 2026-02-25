import { Component, inject } from '@angular/core';
import { PollService, Poll } from '@services/poll';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { RelativeTimePipe } from '@shared/pipes/relative-time-pipe';
import { categoryMap } from '@shared/constants/categories';

@Component({
  selector: 'app-my-polls',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe, RelativeTimePipe],
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

  getCategoryInfo(categoryKey: string) {
    return categoryMap.get(categoryKey);
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
}