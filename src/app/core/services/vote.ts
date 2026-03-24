import { inject, Injectable } from '@angular/core';
import { ApiService } from './base-api';
import { Observable } from 'rxjs';

export interface CastVoteDTO {
  userId: number;
  userName: string;
  pollId: number;
  optionId: number;
  authorId: number;
}

export interface CastVoteResponse {
  pollId: number;
  optionId: number;
  action: 'ADDED' | 'REMOVED' | 'CHANGED';
}

@Injectable({ providedIn: 'root' })
export class VoteService {
  private readonly api = inject(ApiService);

  castVote(dto: CastVoteDTO): Observable<CastVoteResponse> {
    console.log('Votando', dto);
    return this.api.post<CastVoteResponse>('vote', dto);
  }
}