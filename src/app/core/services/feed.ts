import { Injectable, inject, signal, effect } from '@angular/core';
import { ApiService } from './base-api';
import { UserService } from './user';
import { FeedSseService, SseEvent } from '@sse/feed-sse';
import { firstValueFrom } from 'rxjs';
import { Poll, PollReadDTO, PollSearchResultDTO } from '@models/poll.model';

@Injectable({ providedIn: 'root' })
export class FeedService {
  private api = inject(ApiService);
  private userService = inject(UserService);
  private feedSse = inject(FeedSseService);

  private pollsSignal = signal<Poll[]>([]);
  readonly polls = this.pollsSignal.asReadonly();

  private currentUserId: number | null = null;
  private currentPage = 0;
  private _hasMore = true;
  private isLoading = false;
  private searchTerm = '';
  private sortType = 'recent';

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
        this._hasMore = true;
        this.currentPage = 0;
      }
    });

    this.feedSse.events$.subscribe((event: SseEvent) => this.handleSseEvent(event));
  }

  private handleSseEvent(event: SseEvent) {
    const payload = event.payload;
    switch (event.type) {
      case 'POLL_CREATED':
        this.pollsSignal.update(polls => {
          if (polls.some(p => p.id === payload.id)) return polls;
          return [this.mapToPoll(payload), ...polls];
        });
        break;
      case 'POLL_UPDATED':
        this.pollsSignal.update(polls =>
          polls
            .map(p => p.id === payload.pollId ? { ...p, ...this.mapUpdatedPoll(payload) } : p)
            .filter(p => p.active) 
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
    return {
      ...poll,
      totalVotes: payload.totalVotes,
      options: updatedOptions,
      myVotedOptionId: poll.myVotedOptionId === payload.removedOptionId ? null : poll.myVotedOptionId
    };
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
      authorAvatarUrl: dto.authorAvatarUrl || null,
      authorGradient: dto.authorGradient || null,
      title: dto.title,
      category: dto.category,
      active: dto.active,
      createdAt: dto.createdAt,
      myVotedOptionId: dto.myVotedOptionId,
      totalVotes: dto.totalVotes,
      authorId: dto.authorId,
      options: dto.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        votes: opt.totalVotes,
        percentage: opt.percentage,
        displayOrder: opt.displayOrder
      }))
    };
  }

  async search(query: string, size = 10): Promise<PollSearchResultDTO[]> {
    return firstValueFrom(
      this.api.get<PollSearchResultDTO[]>(
        `/poll-read/search?q=${encodeURIComponent(query)}&size=${size}`
      )
    );
  }

  async loadMore() {
    if (this.isLoading || !this._hasMore || !this.currentUserId) return;
    this.isLoading = true;
    this.loading.set(true);
    try {
      const params = new URLSearchParams({
        page: this.currentPage.toString(),
        size: '25',
        sort: this.sortType
      });
      const result = await firstValueFrom(
        this.api.get<{ content: PollReadDTO[]; hasNext: boolean }>(
          `poll-read?${params}`
        )
      );
      const newPolls = result.content.map(dto => this.mapToPoll(dto));
      this.pollsSignal.update(polls => [...polls, ...newPolls]);
      this._hasMore = result.hasNext;
      this.currentPage++;
    } catch (error) {
      this._hasMore = false; // ← para o loop em caso de erro
      console.error('Erro ao carregar feed', error);
    } finally {
      this.isLoading = false;
      this.loading.set(false);
    }
  }

  async reload(search: string = '', sort: string = 'recent') {
    this.searchTerm = search;
    this.sortType = sort;
    this.pollsSignal.set([]);
    this.currentPage = 0;
    this._hasMore = true;
    await this.loadMore();
  }

  applyOptimisticVote(pollId: number, optionId: number | null) {
    this.pollsSignal.update(polls =>
      polls.map(p => p.id === pollId ? { ...p, myVotedOptionId: optionId } : p)
    );
  }
}