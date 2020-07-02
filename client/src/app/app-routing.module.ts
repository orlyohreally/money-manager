import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ErrorModule } from './modules/errors/error.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: './modules/home/home.module#HomeModule'
  },
  {
    path: '',
    loadChildren: './modules/families/family.module#FamilyModule',
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: './modules/user/user.module#UserModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: './modules/auth/auth.module#AuthModule'
  },
  {
    path: 'terms-and-conditions',
    loadChildren:
      // tslint:disable-next-line: max-line-length
      './modules/terms-and-conditions/terms-and-conditions.module#TermsAndConditionsModule'
  },
  {
    path: 'about-us',
    loadChildren: './modules/about-us/about-us.module#AboutUsModule'
  },
  {
    path: 'not-found',
    loadChildren: () => ErrorModule
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
