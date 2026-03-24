import { Component, output, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CATEGORIES, Category, categoryMap } from '@shared/constants/categories';
import { PollSearchResultDTO } from '@models/poll.model';
import { FeedService } from '@services/feed';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './search-modal.html',
  styleUrls: ['./search-modal.scss'],
})
export class SearchModalComponent {
  isOpen = signal(false);
  close = output<void>();
  searchQuery = '';
  searchResults = signal<PollSearchResultDTO[]>([]);
  isSearching = signal(false);
  noResults = signal(false);
  hasSearched = signal(false);
  showResults = computed(() => this.searchResults().length > 0);

  private readonly feedService = inject(FeedService);
  private readonly router = inject(Router);

  readonly popularCategories = CATEGORIES.slice(0, 5);

  open() {
    this.isOpen.set(true);
    this.searchQuery = '';
    this.searchResults.set([]);
    this.noResults.set(false);
    this.hasSearched.set(false);
  }

  closeModal() {
    this.isOpen.set(false);
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) this.closeModal();
  }

  async onSearchEnter() {
    const query = this.searchQuery.trim();
    if (!query) {
      this.clearSearch();
      return;
    }

    this.hasSearched.set(true);
    this.isSearching.set(true);
    this.searchResults.set([]);
    this.noResults.set(false);

    try {
      const results = await this.feedService.search(query);
      this.searchResults.set(results);
      this.noResults.set(results.length === 0);
    } catch {
      this.noResults.set(true);
    } finally {
      this.isSearching.set(false);
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults.set([]);
    this.noResults.set(false);
    this.hasSearched.set(false);
  }

  async searchCategory(categoryKey: string) {
    this.searchQuery = categoryKey;
    await this.onSearchEnter();
  }

  goToPoll(pollId: number) {
    this.closeModal();
    this.router.navigate(['/poll'], { queryParams: { id: pollId } });
  }

  getCategoryInfo(categoryKey: string): Category | undefined {
    return categoryMap.get(categoryKey);
  }

  getTotalVotes(poll: PollSearchResultDTO): number {
    return poll.totalVotes;
  }
}