import { Component, output, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PollService, Poll } from '@services/poll';
import { CATEGORIES, Category, categoryMap } from '@shared/constants/categories';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslatePipe],
  templateUrl: './search-modal.html',
  styleUrls: ['./search-modal.scss']
})
export class SearchModalComponent {
  isOpen = signal(false);
  close = output<void>();

  searchQuery = '';
  searchResults: Poll[] = [];
  showResults = false;
  noResults = false;

  private pollService = inject(PollService);
  private router = inject(Router);

  readonly popularCategories = CATEGORIES.slice(0, 5);

  open() {
    this.isOpen.set(true);
    this.searchQuery = '';
    this.showResults = false;
    this.noResults = false;
  }

  closeModal() {
    this.isOpen.set(false);
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onSearchInput() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.showResults = false;
      this.noResults = false;
      return;
    }

    const allPolls = this.pollService.polls();
    const results = allPolls.filter(p =>
      p.question.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );

    if (results.length > 0) {
      this.searchResults = results;
      this.showResults = true;
      this.noResults = false;
    } else {
      this.searchResults = [];
      this.showResults = false;
      this.noResults = true;
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.showResults = false;
    this.noResults = false;
  }

  goToPoll(pollId: number) {
    this.closeModal();
    this.router.navigate(['/dashboard'], { queryParams: { highlight: pollId } });
  }

  searchCategory(categoryKey: string) {
    this.searchQuery = categoryKey;
    this.onSearchInput();
  }

  getCategoryInfo(categoryKey: string): Category | undefined {
    return categoryMap.get(categoryKey);
  }

  getTotalVotes(poll: Poll): number {
    return poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  }
}