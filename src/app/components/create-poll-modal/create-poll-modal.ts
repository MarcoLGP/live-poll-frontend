import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CATEGORIES } from '@shared/constants/categories';
import { UserService } from '@services/user';
import { PollService } from '@services/poll';
import { PollCreateDTO } from '@models/poll.model';

@Component({
  selector: 'app-create-poll-modal',
  standalone: true,
  imports: [FormsModule, TranslatePipe, DragDropModule],
  templateUrl: './create-poll-modal.html',
  styleUrls: ['./create-poll-modal.scss']
})
export class CreatePollModalComponent {
  private userService = inject(UserService);
  private pollService = inject(PollService);

  isOpen = signal(false);
  close = output<void>();
  create = output<{ question: string; options: string[]; category: string }>();

  question = '';
  options: string[] = ['', ''];
  category = CATEGORIES[0].key;

  readonly categories = CATEGORIES;
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.options, event.previousIndex, event.currentIndex);
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  publish() {
    const filledOptions = this.options
      .map(o => o.trim())
      .filter(o => o.length > 0);

    if (this.question.trim() && filledOptions.length >= this.minOptions) {
      const userId = this.userService.user()?.id;
      if (!userId) {
        console.error('Usuário não autenticado');
        return;
      }

      const payload: PollCreateDTO = {
        title: this.question,
        category: this.category,
        userId: userId,
        userName: this.userService.user()!.username,
        userGradient: this.userService.user()?.gradientAvatar,
        userAvatarUrl: this.userService.user()?.avatarUrl,
        options: filledOptions.map((text, index) => ({
          text: text,
          displayOrder: index
        }))
      };

      this.pollService.createPoll(payload).subscribe({
        next: () => {
          this.closeModal();
        },
        error: (err) => {
          console.error('Erro ao criar enquete', err);
        }
      });
    }
  }

  private reset() {
    this.question = '';
    this.options = ['', ''];
    this.category = CATEGORIES[0].key;
  }
}