import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Family } from '@shared/types';
import { MemberFamily } from '../../shared/types/member-family';
import { FamilyFormComponent } from '../family-form/family-form.component';
import { FamiliesService } from '../services/families/families.service';

@Component({
  selector: 'family-family-editor',
  templateUrl: './family-editor.component.html',
  styleUrls: ['./family-editor.component.scss']
})
export class FamilyEditorComponent implements OnInit {
  @Input() family: Family;
  constructor(
    private familyForm: MatDialog,
    private familiesService: FamiliesService,
    private router: Router
  ) {}

  ngOnInit() {}

  newFamily() {
    const dialogRef = this.familyForm.open(FamilyFormComponent, {
      width: '300px',
      restoreFocus: false,
      data: this.family
    });

    dialogRef.afterClosed().subscribe((family: MemberFamily) => {
      if (!family) {
        return;
      }
      if (!family._id) {
        this.createFamily(family);
        return;
      }
      this.updateFamily(family);
    });
  }

  private updateFamily(family: MemberFamily) {
    this.familiesService.updateFamily(family).subscribe(
      response => {
        // TODO: add handling
        // console.log(response);
      },
      error => {
        // TODO: add handling
        // console.log(error);
      }
    );
  }

  private createFamily(family: MemberFamily) {
    this.familiesService.createFamily(family).subscribe(
      (response: MemberFamily) => {
        this.router.navigate([`/families/${response._id}/dashboard`]);
      },
      error => {
        // TODO: add handling
        // console.log(error);
      }
    );
  }
}
