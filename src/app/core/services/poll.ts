// poll.service.ts
import { inject, Injectable } from '@angular/core';
import { ApiService } from './base-api';
import { Observable } from 'rxjs';
import { PollCreateDTO } from '@models/poll.model';

@Injectable({ providedIn: 'root' })
export class PollService {
  private api = inject(ApiService);

  createPoll(payload: PollCreateDTO): Observable<void> {
    return this.api.post<void>('poll', payload);
  }

  updatePollStatus(pollId: number, active: boolean): Observable<void> {
    return this.api.put<void>(`poll/${pollId}`, { active });
  }

  deletePoll(pollId: number): Observable<void> {
    return this.api.delete<void>(`poll/${pollId}`);
  }
}