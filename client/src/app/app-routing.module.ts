import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PaymentsTimelineComponent } from "./payments-timeline/payments-timeline.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { SignInFormComponent } from "./sign-in-form/sign-in-form.component";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "register", component: SignInFormComponent },
  { path: "payments", component: PaymentsTimelineComponent },
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
