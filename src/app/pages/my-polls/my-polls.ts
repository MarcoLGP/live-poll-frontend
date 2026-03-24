import { Component, inject, OnInit } from '@angular/core';
import { Poll } from '@models/poll.model';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { RelativeTimePipe } from '@shared/pipes/relative-time-pipe';
import { categoryMap } from '@shared/constants/categories';
import { MyPollsService } from '@services/my-polls';
import { PollService } from '@services/poll';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-my-polls',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe, RelativeTimePipe],
  templateUrl: './my-polls.html',
  styleUrls: ['./my-polls.scss']
})
export class MyPollsComponent {
  myPollsService = inject(MyPollsService);
  pollService = inject(PollService);
  polls = this.myPollsService.polls;

  get hasNoPolls(): boolean {
    return this.polls().length === 0;
  }

  getCategoryInfo(categoryKey: string) {
    return categoryMap.get(categoryKey);
  }

  calculatePercentage(part: number, total: number): number {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  }

  async togglePollStatus(poll: Poll) {
    const previousActive = poll.active;
    const newActive = !poll.active;

    this.myPollsService.applyOptimisticStatus(poll.id, newActive);

    try {
      await firstValueFrom(this.pollService.updatePollStatus(poll.id, newActive));
    } catch (error) {
      this.myPollsService.revertOptimisticStatus(poll.id, previousActive);
      console.error('Erro ao alterar status', error);
    }
  }

  async deletePoll(pollId: number) {
    const pollToDelete = this.polls().find(p => p.id === pollId);
    if (!pollToDelete) return;

    this.myPollsService.applyOptimisticDelete(pollId);

    try {
      await firstValueFrom(this.pollService.deletePoll(pollId));
    } catch (error) {
      this.myPollsService.revertOptimisticDelete(pollId, pollToDelete);
      console.error('Erro ao deletar poll', error);
    }
  }

  loadMore() {
    this.myPollsService.loadMore();
  }
}