import { Component } from '@angular/core';

@Component({
  selector: 'app-confetti',
  standalone: true,
  template: `<div id="confetti-container" style="position:fixed; inset:0; pointer-events:none; z-index:9999;"></div>`,
})
export class ConfettiComponent {}