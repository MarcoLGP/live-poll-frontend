import { Injectable, signal } from '@angular/core';

export interface Toast {
  type: 'success' | 'info' | 'error';
  icon: string;
  title: string;
  description?: string;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();
  private nextId = 0;

  show(type: Toast['type'], icon: string, title: string, description?: string) {
    const id = this.nextId++;
    const toast: Toast = { type, icon, title, description, id };
    this.toastsSignal.update(list => [...list, toast]);

    // Auto-remove após 3 segundos
    setTimeout(() => this.remove(id), 3000);
  }

  remove(id: number) {
    this.toastsSignal.update(list => list.filter(t => t.id !== id));
  }
}