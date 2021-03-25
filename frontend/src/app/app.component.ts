import {Component} from '@angular/core';
import {SessionQuery} from './session/state/session.query';
import {SessionService} from './session/state/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public sessionQuery: SessionQuery,
              sessionService: SessionService) {

    sessionService.checkSessionStatus().subscribe();
  }
}
