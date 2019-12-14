import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorModule } from './modules/errors/error.module';
import { AuthGuard } from './core/guards/auth.guard';

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
