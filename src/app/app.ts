import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('live-poll-frontend');
  private translate = inject(TranslateService);

  ngOnInit(): void {
    const storedLang = localStorage.getItem('lang') || 'pt-BR';
    this.translate.use(storedLang);
  }
}
