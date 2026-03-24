import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register-confirmation',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './register-confirmation.html',
  styleUrls: ['./register-confirmation.scss']
})
export class RegisterConfirmationComponent implements OnInit {
  private router = inject(Router);
  email: string = '';

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { email?: string } | undefined;
    this.email = state?.email ?? '';

    if (!this.email) {
      const historyState = history.state as { email?: string };
      this.email = historyState?.email ?? '';
    }
  }
}