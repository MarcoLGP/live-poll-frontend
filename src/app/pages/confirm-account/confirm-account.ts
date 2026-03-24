import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@services/auth';

type ConfirmState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-confirm-account',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './confirm-account.html',
  styleUrls: ['./confirm-account.scss']
})
export class ConfirmAccountComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private auth   = inject(AuthService);
  private cdr    = inject(ChangeDetectorRef);

  state: ConfirmState = 'loading';
  errorMessage = '';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.state = 'error';
      this.errorMessage = 'AUTH.CONFIRM_TOKEN_MISSING';
      this.cdr.markForCheck();
      return;
    }

    this.auth.confirmAccount({ token }).subscribe({
      next: () => {
        this.state = 'success';
        this.cdr.markForCheck();
        setTimeout(() => this.router.navigate(['/dashboard']), 2200);
      },
      error: (err) => {
        this.state = 'error';
        this.errorMessage = err.status === 400
          ? 'AUTH.CONFIRM_TOKEN_INVALID'
          : 'AUTH.CONFIRM_SERVER_ERROR';
        this.cdr.markForCheck();
      }
    });
  }
}