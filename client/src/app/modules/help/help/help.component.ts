import { Component, OnInit } from '@angular/core';
import { BlogPost } from '@src/app/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { ButterCMSService } from '@core-client/services/butter-cms/butter-cms.service';

@Component({
  selector: 'help-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  isActive = false;
  helpLinks: Observable<BlogPost[]>;

  constructor(private butterCMSService: ButterCMSService) {}

  ngOnInit() {
    this.helpLinks = this.butterCMSService.getPosts(1, 10).pipe(
      map(data => {
        return data.data.slice(0, 5);
      })
    );
  }

  toggleHelp() {
    this.isActive = !this.isActive;
  }
}
