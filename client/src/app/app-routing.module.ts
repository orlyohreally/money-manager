import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", loadChildren: "./modules/home/home.module#HomeModule" },
  { path: "auth", loadChildren: "./modules/auth/auth.module#AuthModule" },
  {
    path: "payments",
    loadChildren: "./modules/payments/payment.module#PaymentModule"
  },
  {
    path: "**",
    loadChildren: "./modules/errors/error.module#ErrorModule"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
