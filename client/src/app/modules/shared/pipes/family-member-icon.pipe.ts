import { Pipe, PipeTransform } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { MembersService } from '@core-client/services/members/members.service';
import { FamilyMember } from '@shared/types';

@Pipe({
  name: 'familyMemberIcon'
})
export class FamilyMemberIconPipe implements PipeTransform {
  constructor(private membersService: MembersService) {}

  transform(member: FamilyMember): SafeResourceUrl {
    return this.membersService.getMemberIcon(member);
  }
}
