import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FamiliesService } from '../services/families/families.service';
import { MatDialog } from '@angular/material';
import { ImageManagerComponent } from '../../shared/components/image-manager/image-manager.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss']
})
export class FamilyComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private familiesService: FamiliesService
  ) {}
  family: { name: string; icon: string; membersCount: number };
  familyForm: FormGroup;
  toChangeName: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const familyId = params.get('familyId');
      this.getFamily(familyId);
    });
  }

  familyIconLoaded(iconUrl: string) {
    const updatedFamily = JSON.parse(JSON.stringify(this.family));
    updatedFamily.icon = iconUrl;
    this.familiesService.updateFamily(updatedFamily).subscribe(
      family => {
        console.log(family);
      },
      error => {
        console.log(error);
      }
    );
  }

  getMembersCountText(): string {
    return `${this.family.membersCount} ${
      this.family.membersCount === 1 ? 'member' : 'members'
    }`;
  }

  showNameEditor() {
    this.familyForm = new FormGroup({
      name: new FormControl(this.family.name, [Validators.required])
    });

    this.toChangeName = true;
  }

  updatedFamilyName() {
    const updatedFamily = JSON.parse(JSON.stringify(this.family));
    updatedFamily.name = this.familyForm.get('name').value;
    this.familiesService.updateFamily(updatedFamily).subscribe(() => {
      this.toChangeName = false;
      this.family.name = this.familyForm.get('name').value;
    });
  }

  private getFamily(familyId: string): void {
    this.family = null;
    this.familiesService.getFamily(familyId).subscribe(
      family => {
        this.family = family;
        console.log(this.family);
      },
      error => {
        console.log(error);
      }
    );
  }
}
