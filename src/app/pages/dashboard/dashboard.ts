import { Component, inject, OnInit, AfterViewInit, OnDestroy, signal, ElementRef, viewChild } from '@angular/core';
import { PollCardComponent } from '@components/poll-card/poll-card';
import { TranslatePipe } from '@ngx-translate/core';
import { FeedService } from '@services/feed';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslatePipe, PollCardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  readonly feedService = inject(FeedService);

  readonly polls = this.feedService.polls;

  sentinel = viewChild<ElementRef>('sentinel');
  activeFilter = signal<'recent' | 'old'>('recent');

  private observer!: IntersectionObserver;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.feedService.loading() && this.feedService.hasMore) {
          this.feedService.loadMore();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );

    const el = this.sentinel();
    if (el) this.observer.observe(el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  loadMore() {
    this.feedService.loadMore();
  }

  setFilter(filter: 'recent' | 'old') {
    if (this.activeFilter() === filter) return;
    this.activeFilter.set(filter);
    this.feedService.reload(filter);
  }

  onVote(event: { pollId: number; optionId: number | null }) {
    this.feedService.applyOptimisticVote(event.pollId, event.optionId);
  }
}