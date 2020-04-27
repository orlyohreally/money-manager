import { Pipe, PipeTransform } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FamilyMember } from '@shared/types';

@Pipe({
  name: 'familyMemberIcon'
})
export class FamilyMemberIconPipeMock implements PipeTransform {
  constructor() {}

  transform(member: FamilyMember): SafeResourceUrl {
    return `icon-for-${member.firstName}-${member.lastName}-member`;
  }
}
