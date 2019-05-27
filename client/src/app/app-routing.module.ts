import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PaymentListComponent } from "./modules/payments/payment-list/payment-list.component";
import { PageNotFoundComponent } from "./modules/errors/page-not-found/page-not-found.component";
import { HomePageComponent } from "./modules/home/home-page/home-page.component";
import { SignInFormComponent } from "./modules/auth/sign-in-form/sign-in-form.component";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "register", component: SignInFormComponent },
  { path: "payments", component: PaymentListComponent },
  {
    path: "**",
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
