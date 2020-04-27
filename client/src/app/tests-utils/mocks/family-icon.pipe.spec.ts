import { Pipe, PipeTransform } from '@angular/core';
import { Family } from '@shared/types';

@Pipe({
  name: 'familyIcon'
})
export class FamilyIconPipeMock implements PipeTransform {
  constructor() {}

  transform(family: Family): string {
    return `icon for ${family ? family.name : 'undefined'} family`;
  }
}
