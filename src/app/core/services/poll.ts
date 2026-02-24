import { Injectable, signal } from '@angular/core';
import { Poll } from '../models/poll.model';

@Injectable({ providedIn: 'root' })
export class PollService {
  private pollsSignal = signal<Poll[]>([
    {
      id: 1,
      question: 'Qual é o melhor framework frontend em 2025?',
      category: 'tech',
      options: [
        { text: 'React', votes: 412 },
        { text: 'Vue.js', votes: 258 },
        { text: 'Angular', votes: 141 },
        { text: 'Svelte', votes: 109 }
      ],
      voted: false,
      votedIndex: null,
      createdAt: Date.now() - 7200000
    },
  ]);

  readonly polls = this.pollsSignal.asReadonly();

  addPoll(poll: Poll) {
    this.pollsSignal.update(p => [poll, ...p]);
  }

  vote(pollId: number, optionIndex: number) {
    this.pollsSignal.update(polls =>
      polls.map(poll =>
        poll.id === pollId && !poll.voted
          ? {
              ...poll,
              options: poll.options.map((opt, idx) =>
                idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
              ),
              voted: true,
              votedIndex: optionIndex
            }
          : poll
      )
    );
  }
}