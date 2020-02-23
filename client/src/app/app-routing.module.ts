import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ErrorModule } from './modules/errors/error.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: './modules/home/home.module#HomeModule',
    canActivate: [AuthGuard]
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
