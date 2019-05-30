import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FamilyComponent } from "./family/family.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ErrorModule } from "../errors/error.module";
import { PaymentListComponent } from "../payments/payment-list/payment-list.component";
import { FamiliesComponent } from "./families.component";

const routes: Routes = [
  { path: "families", component: FamiliesComponent },
  {
    path: "families/:familyName",
    component: FamilyComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "payments",
        component: PaymentListComponent
      },
      {
        path: "**",
        redirectTo: "dashboard"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamilyRoutingModule {}
