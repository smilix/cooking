import {Component} from '@angular/core';
import {SessionQuery} from './session/state/session.query';
import {SessionService} from './session/state/session.service';
import {SearchService} from './shared/search/search.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public sessionQuery: SessionQuery,
              sessionService: SessionService,
              private searchService: SearchService) {

    sessionService.checkSessionStatus().subscribe();
  }

  showSearch(): void {
    this.searchService.showSearch();
  }
}
