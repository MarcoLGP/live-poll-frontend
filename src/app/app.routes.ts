import { Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home';
import { LoginComponent } from '@pages/login/login';
import { RegisterComponent } from '@pages/register/register';
import { DashboardComponent } from '@pages/dashboard/dashboard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout';
import { MyPollsComponent } from '@pages/my-polls/my-polls';
import { MyVotesComponent } from '@pages/my-votes/my-votes';
import { authGuard } from './core/guards/auth-guard';
import { LoginSuccessComponent } from '@pages/login-success/login-success';
import { PollDetailComponent } from '@pages/poll-detail/poll-detail';
import { RegisterConfirmationComponent } from '@pages/register-confirmation/register-confirmation';
import { ConfirmAccountComponent } from '@pages/confirm-account/confirm-account';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password';
import { ResetPasswordComponent } from '@pages/reset-password/reset-password';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'login-success', component: LoginSuccessComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register/confirmation', component: RegisterConfirmationComponent },
      { path: 'confirm-account', component: ConfirmAccountComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent }
    ]
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'my-polls', component: MyPollsComponent },
      { path: 'my-votes', component: MyVotesComponent },
      { path: 'poll', component: PollDetailComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];