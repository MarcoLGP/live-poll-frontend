import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Poll } from '@models/poll.model';
import { RelativeTimePipe } from '@shared/pipes/relative-time-pipe';
import { categoryMap } from '@shared/constants/categories';
import { MyVotesService } from '@services/my-votes';

@Component({
  selector: 'app-my-votes',
  standalone: true,
  imports: [TranslatePipe, RelativeTimePipe],
  templateUrl: './my-votes.html',
  styleUrls: ['./my-votes.scss']
})
export class MyVotesComponent implements OnInit {
  myVotesService = inject(MyVotesService);
  polls = this.myVotesService.polls;

  ngOnInit() {
    this.myVotesService.reload();
  }

  get votedPolls(): Poll[] {
    return this.polls().filter(p => p.myVotedOptionId !== null);
  }

  getChosenOption(poll: Poll): Poll['options'][0] | undefined {
    return poll.options.find(opt => opt.id === poll.myVotedOptionId);
  }

  getCategoryInfo(categoryKey: string) {
    return categoryMap.get(categoryKey);
  }

  calculatePercentage(votes: number, total: number): number {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  }

  loadMore() {
    this.myVotesService.loadMore();
  }
}