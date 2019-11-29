import { Component, OnInit } from '@angular/core';
import { PaymentFormComponent } from '../../payments/payment-form/payment-form.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FamilyFormComponent } from '../../families/family-form/family-form.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnInit() {}

  public createFamily(): void {
    const dialogRef = this.dialog.open(FamilyFormComponent, {
      width: '300px',
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.router.navigate(['families']);
      }
    });
  }

  public createPayment(): void {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: '300px',
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.router.navigate(['payments']);
      }
    });
  }

  public createReport(): void {
    console.log('not implemented yet');
  }
}
