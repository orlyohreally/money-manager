import { Pipe, PipeTransform } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { Family } from '@shared/types';

@Pipe({
  name: 'familyIcon'
})
export class FamilyIconPipe implements PipeTransform {
  constructor(private familiesService: FamiliesService) {}

  transform(family: Family): string {
    return this.familiesService.getFamilyIcon(family);
  }
}
