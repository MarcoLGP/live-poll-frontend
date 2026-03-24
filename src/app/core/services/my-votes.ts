import { Injectable, inject, signal, effect } from '@angular/core';
import { ApiService } from './base-api';
import { UserService } from './user';
import { FeedSseService, SseEvent } from '@sse/feed-sse';
import { Poll, PollReadDTO } from '@models/poll.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MyVotesService {
  private api = inject(ApiService);
  private userService = inject(UserService);
  private feedSse = inject(FeedSseService);

  private pollsSignal = signal<Poll[]>([]);
  readonly polls = this.pollsSignal.asReadonly();

  private currentUserId: number | null = null;
  private currentPage = 0;
  private _hasMore = true;
  private isLoading = false;
  readonly loading = signal(false);

  get hasMore(): boolean {
    return this._hasMore;
  }

  constructor() {
    effect(() => {
      const user = this.userService.user();
      if (user) {
        this.currentUserId = user.id;
        this.reload();
      } else {
        this.pollsSignal.set([]);
        this.currentUserId = null;
      }
    });

    this.feedSse.events$.subscribe((event: SseEvent) => this.handleSseEvent(event));
  }

  private handleSseEvent(event: SseEvent) {
    if (!this.currentUserId) return;
    const payload = event.payload;

    switch (event.type) {
      case 'POLL_UPDATED':
        this.pollsSignal.update(polls =>
          polls.map(p => p.id === payload.pollId ? { ...p, ...this.mapUpdatedPoll(payload) } : p)
        );
        break;

      case 'POLL_DELETED':
        this.pollsSignal.update(polls => polls.filter(p => p.id !== payload.pollId));
        break;

      case 'OPTION_REMOVED':
        this.pollsSignal.update(polls =>
          polls.map(p => this.applyOptionRemoved(p, payload))
        );
        break;

      case 'VOTE_UPDATED':
        this.pollsSignal.update(polls =>
          polls.map(p => this.applyVoteUpdated(p, payload))
        );
        break;
    }
  }

  private applyOptionRemoved(poll: Poll, payload: any): Poll {
    if (poll.id !== payload.pollId) return poll;
    const newOptions = poll.options.filter(opt => opt.id !== payload.removedOptionId);
    const updatedOptions = newOptions.map(opt => {
      const updated = payload.updatedOptions.find((u: any) => u.id === opt.id);
      return updated ? { ...opt, votes: updated.totalVotes, percentage: updated.percentage } : opt;
    });
    const wasVoted = poll.myVotedOptionId === payload.removedOptionId;
    const updatedPoll = {
      ...poll,
      totalVotes: payload.totalVotes,
      options: updatedOptions,
      myVotedOptionId: wasVoted ? null : poll.myVotedOptionId
    };
    return updatedPoll;
  }

  private applyVoteUpdated(poll: Poll, payload: any): Poll {
    if (poll.id !== payload.pollId) return poll;
    const newOptions = poll.options.map(opt => {
      const updated = payload.options.find((u: any) => u.id === opt.id);
      return updated ? { ...opt, votes: updated.totalVotes, percentage: updated.percentage } : opt;
    });
    return {
      ...poll,
      totalVotes: payload.totalVotes,
      options: newOptions
    };
  }

  private mapUpdatedPoll(payload: any): Partial<Poll> {
    return {
      title: payload.title,
      category: payload.category,
      active: payload.active
    };
  }

  private mapToPoll(dto: PollReadDTO): Poll {
    return {
      id: dto.id,
      authorName: dto.authorName,
      authorAvatarUrl: dto.authorAvatarUrl,
      authorGradient: dto.authorGradient,
      title: dto.title,
      authorId: dto.authorId,
      category: dto.category,
      active: dto.active,
      createdAt: dto.createdAt,
      myVotedOptionId: dto.myVotedOptionId,
      totalVotes: dto.totalVotes,
      options: dto.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        votes: opt.totalVotes,
        percentage: opt.percentage,
        displayOrder: opt.displayOrder
      }))
    };
  }

  async loadMore() {
    if (this.isLoading || !this._hasMore || !this.currentUserId) return;
    this.isLoading = true;
    this.loading.set(true);
    try {
      const result = await firstValueFrom(
        this.api.get<{ content: PollReadDTO[]; hasNext: boolean }>(
          `/poll-read/my-votes?page=${this.currentPage}&size=25`
        )
      );
      const newPolls = result.content.map(dto => this.mapToPoll(dto));
      this.pollsSignal.update(polls => [...polls, ...newPolls]);
      this._hasMore = result.hasNext;
      this.currentPage++;
    } catch (error) {
      console.error('Erro ao carregar my votes', error);
    } finally {
      this.isLoading = false;
      this.loading.set(false);
    }
  }

  async reload() {
    this.pollsSignal.set([]);
    this.currentPage = 0;
    this._hasMore = true;
    await this.loadMore();
  }

  addVotedPoll(poll: Poll) {
    this.pollsSignal.update(polls => {
      if (polls.some(p => p.id === poll.id)) return polls;
      return [poll, ...polls];
    });
  }

  removeVotedPoll(pollId: number) {
    this.pollsSignal.update(polls => polls.filter(p => p.id !== pollId));
  }
}