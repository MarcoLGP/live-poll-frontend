import { Component, effect, inject, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { categoryMap, Category } from '@shared/constants/categories';
import { RelativeTimePipe } from '@shared/pipes/relative-time-pipe';
import { Poll, PollOption } from '@models/poll.model';
import { UserService } from '@services/user';
import { VoteService } from '@services/vote';

@Component({
  selector: 'app-poll-card',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe, RelativeTimePipe],
  templateUrl: './poll-card.html',
  styleUrls: ['./poll-card.scss']
})
export class PollCardComponent {
  poll = input.required<Poll>();
  vote = output<{ pollId: number; optionId: number | null }>();
  avatarError = false;

constructor() {
  effect(() => {
    this.poll(); 
    this.avatarError = false;
  });
}

  readonly votingOptionId = signal<number | null>(null);

  private readonly voteService = inject(VoteService);
  readonly user = inject(UserService).user;

  getCategoryInfo(key: string): Category | undefined {
    return categoryMap.get(key);
  }

  get totalVotes(): number {
    return this.poll().totalVotes;
  }

  getPercentage(option: PollOption): number {
    return option.percentage;
  }

  isSelected(option: PollOption): boolean {
    return this.poll().myVotedOptionId === option.id;
  }

  onVote(option: PollOption): void {
    if (!this.poll().active) return;
    if (this.votingOptionId() !== null) return; // ← evita double click

    const poll = this.poll();
    const previousVotedOptionId = poll.myVotedOptionId;
    const isSameOption = previousVotedOptionId === option.id;
    const optimisticVotedOptionId = isSameOption ? null : option.id;

    this.votingOptionId.set(option.id);
    this.vote.emit({ pollId: poll.id, optionId: optimisticVotedOptionId });

    this.voteService.castVote({
      userId: this.user()!.id,
      userName: this.user()!.username,
      pollId: poll.id,
      optionId: option.id,
      authorId: poll.authorId
    }).subscribe({
      next: () => this.votingOptionId.set(null),
      error: () => {
        this.vote.emit({ pollId: poll.id, optionId: previousVotedOptionId });
        this.votingOptionId.set(null);
      }
    });
  }
}