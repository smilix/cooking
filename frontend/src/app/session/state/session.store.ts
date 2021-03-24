import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';

export interface SessionState {
  loggedIn: boolean;
}

export function createInitialState(): SessionState {
  return {
    loggedIn: false,
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'session'})
export class SessionStore extends Store<SessionState> {

  constructor() {
    super(createInitialState());
  }
}
