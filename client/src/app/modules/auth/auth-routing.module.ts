import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignInFormComponent } from "./sign-in-form/sign-in-form.component";

const routes: Routes = [
  {
    path: "register",
    component: SignInFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
