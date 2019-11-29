import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FamilyFormComponent } from '../family-form/family-form.component';
import { Family } from '@shared/types';
import {
  FamiliesService,
  MemberFamily
} from '../services/families/families.service';

@Component({
  selector: 'family-family-editor',
  templateUrl: './family-editor.component.html',
  styleUrls: ['./family-editor.component.scss']
})
export class FamilyEditorComponent implements OnInit {
  @Input() family: Family;
  constructor(
    private familyForm: MatDialog,
    private familiesService: FamiliesService
  ) {}

  ngOnInit() {}

  newFamily() {
    const dialogRef = this.familyForm.open(FamilyFormComponent, {
      width: '300px',
      restoreFocus: false,
      data: this.family
    });

    dialogRef.afterClosed().subscribe((family: MemberFamily) => {
      console.log(family);
      if (!family) {
        return;
      }
      if (!family._id) {
        console.log('creating family');
        this.createFamily(family);
        return;
      }
      this.updateFamily(family);
    });
  }

  private updateFamily(family: MemberFamily) {
    console.log('update', family);
    this.familiesService.updateFamily(family).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }

  private createFamily(family: MemberFamily) {
    this.familiesService.createFamily(family).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }
}
