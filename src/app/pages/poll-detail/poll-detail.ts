import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PollCardComponent } from '@components/poll-card/poll-card';
import { ApiService } from '@services/base-api';
import { FeedService } from '@services/feed';
import { Poll, PollReadDTO } from '@models/poll.model';

@Component({
  selector: 'app-poll-detail',
  standalone: true,
  imports: [TranslatePipe, PollCardComponent],
  templateUrl: './poll-detail.html',
  styleUrls: ['./poll-detail.scss']
})
export class PollDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private feedService = inject(FeedService);
  private cdr = inject(ChangeDetectorRef);

  poll = signal<Poll | null>(null);
  loading = signal(true);
  notFound = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (!id) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }
    this.loadPoll(Number(id));
  }

  private loadPoll(id: number) {
    this.api.get<PollReadDTO>(`poll-read/${id}`).subscribe({
      next: (dto) => {
        this.poll.set(this.mapToPoll(dto));
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  onVote(event: { pollId: number; optionId: number | null }) {
    this.feedService.applyOptimisticVote(event.pollId, event.optionId);
    this.poll.update(p => p ? { ...p, myVotedOptionId: event.optionId } : p);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  private mapToPoll(dto: PollReadDTO): Poll {
    return {
      id: dto.id,
      title: dto.title,
      category: dto.category,
      authorId: dto.authorId,
      authorName: dto.authorName,
      authorGradient: dto.authorGradient,
      authorAvatarUrl: dto.authorAvatarUrl,
      createdAt: dto.createdAt,
      active: dto.active,
      totalVotes: dto.totalVotes,
      myVotedOptionId: dto.myVotedOptionId,
      options: dto.options.map(o => ({
        id: o.id,
        text: o.text,
        votes: o.totalVotes,
        percentage: o.percentage,
        displayOrder: o.displayOrder
      }))
    };
  }
}