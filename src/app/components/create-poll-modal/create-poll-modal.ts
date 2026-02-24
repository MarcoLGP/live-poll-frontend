import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-create-poll-modal',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './create-poll-modal.html',
  styleUrls: ['./create-poll-modal.scss']
})
export class CreatePollModalComponent {
  isOpen = signal(false);
  close = output<void>();
  create = output<{ question: string; options: string[]; category: string }>();

  question = '';
  options: string[] = ['', ''];
  category = '💻 Tecnologia';

  readonly categories = ['💻 Tecnologia', '🎮 Games', '🎵 Música', '🏀 Esportes', '🍕 Comida', '💬 Geral'];
  readonly maxOptions = 8;
  readonly minOptions = 2;

  open() {
    this.isOpen.set(true);
    this.reset();
  }

  closeModal() {
    this.isOpen.set(false);
    this.close.emit();
  }

  addOption() {
    if (this.options.length < this.maxOptions) {
      this.options = [...this.options, ''];
    }
  }

  removeOption(index: number) {
    if (this.options.length > this.minOptions) {
      this.options = this.options.filter((_, i) => i !== index);
    }
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  publish() {
    const filledOptions = this.options.map(o => o.trim()).filter(o => o.length > 0);
    if (this.question.trim() && filledOptions.length >= this.minOptions) {
      this.create.emit({
        question: this.question,
        options: filledOptions,
        category: this.category
      });
      this.closeModal();
    }
  }

  private reset() {
    this.question = '';
    this.options = ['', ''];
    this.category = this.categories[0];
  }
}