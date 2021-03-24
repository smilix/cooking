import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {SessionState, SessionStore} from './session.store';

@Injectable({providedIn: 'root'})
export class SessionQuery extends Query<SessionState> {

  readonly isLoggedIn$ = this.select(s => s.loggedIn);

  constructor(protected store: SessionStore) {
    super(store);
  }

}
