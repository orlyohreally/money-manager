import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { FamilyFormComponent } from "../family-form/family-form.component";

@Component({
  selector: "family-new-family",
  templateUrl: "./new-family.component.html",
  styleUrls: ["./new-family.component.scss"]
})
export class NewFamilyComponent implements OnInit {
  constructor(private familyForm: MatDialog) {}

  ngOnInit() {}
  public newFamily() {
    this.openForm();
  }
  public openForm(): void {
    const dialogRef = this.familyForm.open(FamilyFormComponent, {
      width: "300px",
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
