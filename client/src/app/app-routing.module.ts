import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ErrorModule } from "./modules/errors/error.module";
import { DashboardComponent } from "./modules/families/dashboard/dashboard.component";
import { FamilyComponent } from "./modules/families/family/family.component";
import { PaymentListComponent } from "./modules/payments/payment-list/payment-list.component";
import { FamiliesComponent } from "./modules/families/families.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: "./modules/home/home.module#HomeModule"
  },
  {
    path: "",
    loadChildren: "./modules/families/family.module#FamilyModule"
  },
  {
    path: "auth",
    loadChildren: "./modules/auth/auth.module#AuthModule"
  },
  {
    path: "not-found",
    loadChildren: () => ErrorModule
  },
  {
    path: "**",
    redirectTo: "not-found"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
