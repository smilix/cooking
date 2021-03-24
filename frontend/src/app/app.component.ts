import {Component, ViewChild} from '@angular/core';
import {SessionService} from './session/state/session.service';
import {Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatSidenav} from '@angular/material/sidenav';
import {SessionQuery} from './session/state/session.query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  // mobileQuery: MediaQueryList;

  // @ViewChild('snav')
  // private snav!: MatSidenav;

  constructor(media: MediaMatcher,
              public sessionQuery: SessionQuery,
              private sessionService: SessionService,
              private router: Router,
  ) {
    // this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  checkClose(): void {
    // if (this.mobileQuery.matches) {
    //   this.snav.close();
    // }
  }

}
