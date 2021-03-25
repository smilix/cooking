import {Component} from '@angular/core';
import {SessionQuery} from './session/state/session.query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public sessionQuery: SessionQuery) {
  }
}
