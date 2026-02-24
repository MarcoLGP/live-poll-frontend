import { Component, inject } from '@angular/core';
import { ToastService } from '@services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class.toast-success]="toast.type === 'success'"
             [class.toast-info]="toast.type === 'info'"
             [class.toast-error]="toast.type === 'error'">
          <div class="toast-icon">{{ toast.icon }}</div>
          <div>
            <div style="font-weight:600;font-size:14px;color:var(--txt)">{{ toast.title }}</div>
            @if (toast.description) {
              <div style="font-size:12px;color:var(--txt2);margin-top:2px">{{ toast.description }}</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .toast {
      background: var(--bg2);
      border: 1px solid var(--border-hi);
      border-radius: 14px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--txt);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      animation: toast-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
      pointer-events: all;
      min-width: 260px;
    }
    .toast.toast-success .toast-icon { background: rgba(34,211,160,0.15); color: var(--green); }
    .toast.toast-info .toast-icon { background: rgba(124,111,247,0.15); color: var(--primary-2); }
    .toast.toast-error .toast-icon { background: rgba(239,68,68,0.15); color: #EF4444; }
    .toast-icon {
      width: 32px; height: 32px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}