import { Component, OnInit } from "@angular/core";
import { HomePageSection } from "../home-page-section";
import { PaymentFormComponent } from "../payment-form/payment-form.component";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { FamilyFormComponent } from "../family-form/family-form.component";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent implements OnInit {
  sections: HomePageSection[];
  componentForms: { [name: string]: { component: any; width: string } };
  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.componentForms = {
      payments: { component: PaymentFormComponent, width: "300px" },
      families: { component: FamilyFormComponent, width: "300px" }
    };
    this.sections = [
      {
        name: "families",
        title: "Create family and add all your family members",
        image: {
          path: "assets/icons/family.jpg",
          link: "https://www.freepik.com/free-photos-vectors/people"
        },
        button: {
          label: "Create family",
          classes: "text-uppercase lg-button"
        }
      },
      {
        name: "payments",
        title: "Submit your payments in seconds",
        image: {
          path: "assets/icons/payment.jpg",
          link: "https://www.freepik.com/free-photos-vectors/banner"
        },
        button: {
          label: "Create payment",
          classes: "text-uppercase lg-button"
        }
      },
      {
        name: "report",
        title: "Analyze your expenses and plan financial future",
        image: {
          path: "assets/icons/planning.jpg",
          link: "https://www.freepik.com/free-photos-vectors/background"
        },
        button: {
          label: "Create expenses report",
          classes: "text-uppercase lg-button"
        }
      }
    ];
  }
  public openForm(formName: string): void {
    console.log(formName, this.componentForms);

    const dialogRef = this.dialog.open(
      this.componentForms[formName].component,
      {
        width: this.componentForms[formName].width,
        restoreFocus: false
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.router.navigate([formName]);
      }
    });
  }
}
