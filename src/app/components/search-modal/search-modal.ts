import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-modal.html',
  styleUrls: ['./search-modal.scss']
})
export class SearchModalComponent {
  isOpen = signal(false);
  close = output<void>();

  searchQuery = '';
  searchResults: any[] = [];
  showResults = false;
  noResults = false;

  private mockPolls = [
    { id: 1, question: 'Qual framework frontend você usa?', author: 'Ana Lima', initials: 'AL', color: 'linear-gradient(135deg,#5B8DF7,#9B79F5)', category: '💻 Tecnologia', votes: 93, live: true },
    { id: 2, question: 'Melhor jogo de 2024?', author: 'Carlos M.', initials: 'CM', color: 'linear-gradient(135deg,#F06292,#FF8A65)', category: '🎮 Games', votes: 104, live: true },
  ];

  getCategoryStyle(category: string): { bg: string; c: string } {
  const map: Record<string, { bg: string; c: string }> = {
    '💻 Tecnologia': { bg: 'rgba(91,141,247,.12)', c: '#5B8DF7' },
    '🎮 Games':      { bg: 'rgba(155,121,245,.12)', c: '#9B79F5' },
    '🎵 Música':     { bg: 'rgba(240,98,146,.12)',  c: '#F06292' },
    '🏀 Esportes':   { bg: 'rgba(82,217,160,.12)',  c: '#52D9A0' },
    '🍕 Comida':     { bg: 'rgba(245,179,66,.12)',  c: '#F5B342' },
    '💬 Geral':      { bg: 'rgba(255,255,255,.06)', c: '#8892B0' },
  };
  return map[category] || map['💬 Geral'];
}

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

    // Simulação de busca
    const results = this.mockPolls.filter(p =>
      p.question.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );

    if (results.length > 0) {
      this.searchResults = results;
      this.showResults = true;
      this.noResults = false;
    } else {
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
  }

  searchCategory(cat: string) {
    this.searchQuery = cat;
    this.onSearchInput();
  }
}