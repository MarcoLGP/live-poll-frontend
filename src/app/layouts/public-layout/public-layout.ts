import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LogoComponent } from '@components/logo/logo';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TranslatePipe, LogoComponent],
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.scss']
})
export class PublicLayoutComponent {
  private translate = inject(TranslateService);
  currentLang = this.translate.currentLang || 'pt-BR';

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}