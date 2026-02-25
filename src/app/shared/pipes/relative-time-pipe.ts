import { Pipe, PipeTransform, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'relativeTime',
  standalone: true,
  pure: false 
})
export class RelativeTimePipe implements PipeTransform, OnDestroy {
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  private langChangeSub: Subscription;
  private lastValue: Date | string | number | null = null;
  private lastResult: string = '';

  constructor() {
    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      if (this.lastValue !== null) {
        this.lastResult = this.transform(this.lastValue);
        this.cdr.markForCheck(); 
      }
    });
  }

  transform(value: Date | string | number): string {
    if (!value) return '';

    this.lastValue = value;

    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 60) {
      return this.translate.instant('TIME.JUST_NOW');
    }

    if (diffMin < 60) {
      const key = diffMin === 1 ? 'TIME.MINUTE_AGO' : 'TIME.MINUTES_AGO';
      return this.translate.instant(key, { count: diffMin });
    }

    if (diffHrs < 24) {
      const key = diffHrs === 1 ? 'TIME.HOUR_AGO' : 'TIME.HOURS_AGO';
      return this.translate.instant(key, { count: diffHrs });
    }

    if (diffDays < 7) {
      const key = diffDays === 1 ? 'TIME.DAY_AGO' : 'TIME.DAYS_AGO';
      return this.translate.instant(key, { count: diffDays });
    }

    return date.toLocaleDateString(this.translate.currentLang);
  }

  ngOnDestroy() {
    this.langChangeSub.unsubscribe();
  }
}