import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-login-success',
  standalone: true,
  imports: [TranslatePipe],
  template: `<p>{{ 'AUTH.PROCESSING_LOGIN' | translate }}</p>`
})
export class LoginSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit(): void {
    const fragment = this.route.snapshot.fragment;
    console.log('Fragment recebido:', fragment);
    if (fragment) {
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      console.log('Token extraído:', accessToken);
      if (accessToken) {
        this.auth.handleSocialLoginResponse(accessToken);
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login'], { queryParams: { error: 'no_token' } });
      }
    } else {
      // Sem fragmento – erro
      this.router.navigate(['/login'], { queryParams: { error: 'invalid_response' } });
    }
  }
}