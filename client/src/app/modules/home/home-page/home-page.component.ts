import { Component, OnInit } from "@angular/core";
import { HomePageSection } from "@shared-client/types/home-page-section";
import { PaymentFormComponent } from "../../payments/payment-form/payment-form.component";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { FamilyFormComponent } from "../../families/family-form/family-form.component";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent implements OnInit {
  sections: HomePageSection[];
  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnInit() {
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
          classes: "text-uppercase button_lg"
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
          classes: "text-uppercase button_lg"
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
          classes: "text-uppercase button_lg"
        }
      }
    ];
  }
  public createFamily(): void {
    const dialogRef = this.dialog.open(FamilyFormComponent, {
      width: "300px",
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.router.navigate(["families"]);
      }
    });
  }

  public createPayment(): void {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: "300px",
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.router.navigate(["payments"]);
      }
    });
  }

  public createReport(): void {
    console.log("not implemented yet");
  }
}
