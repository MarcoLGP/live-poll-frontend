import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  private colors = ['#7C6FF7', '#A78BFA', '#F59E0B', '#22D3A0', '#F472B6', '#60A5FA', '#FBBF24', '#34D399'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  launch(x: number, y: number) {
    if (!isPlatformBrowser(this.platformId)) return;

    const container = document.getElementById('confetti-container');
    if (!container) return;

    const count = 40;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = 4 + Math.random() * 8;
      piece.style.cssText = `
        left: ${x + (Math.random() - 0.5) * 100}px;
        top: ${y - 20}px;
        background: ${this.colors[Math.floor(Math.random() * this.colors.length)]};
        width: ${size}px;
        height: ${size}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confetti-fall ${0.8 + Math.random() * 0.8}s ease-out forwards;
        animation-delay: ${Math.random() * 0.2}s;
      `;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 2000);
    }
  }
}