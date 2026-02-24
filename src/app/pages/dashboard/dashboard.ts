import { Component, inject } from '@angular/core';
import { PollCardComponent } from '@components/poll-card/poll-card';
import { AuthService } from '@services/auth';
import { Poll, PollService } from '@services/poll';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PollCardComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {
  auth = inject(AuthService);

  private pollService = inject(PollService);

  user = this.auth.user;       
  polls = this.pollService.polls; 

  activeFilter: 'recent' | 'top' | 'mine' = 'recent';

  get filteredPolls(): Poll[] {
    const all = this.polls();
    switch (this.activeFilter) {
      case 'top':
        return [...all].sort(
          (a, b) =>
            b.options.reduce((s, o) => s + o.votes, 0) -
            a.options.reduce((s, o) => s + o.votes, 0)
        );
      case 'mine':
        return all.filter(p => p.mine);
      default:
        return all; 
    }
  }

  onVote(pollId: number, optionIndex: number): void {
    this.pollService.vote(pollId, optionIndex);
  }

  setFilter(filter: 'recent' | 'top' | 'mine'): void {
    this.activeFilter = filter;
  }
}