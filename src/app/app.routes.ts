import { Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home';
import { LoginComponent } from '@pages/login/login';
import { RegisterComponent } from '@pages/register/register';
import { DashboardComponent } from '@pages/dashboard/dashboard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout';
import { MyPollsComponent } from '@pages/my-polls/my-polls';
import { MyVotesComponent } from '@pages/my-votes/my-votes';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'my-polls', component: MyPollsComponent },
      { path: 'my-votes', component: MyVotesComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];