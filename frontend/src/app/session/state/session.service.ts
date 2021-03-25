import {HttpClient, HttpXsrfTokenExtractor} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {switchMap, tap} from 'rxjs/operators';
import {SessionStore} from './session.store';
import {Observable, of} from 'rxjs';
import {SessionQuery} from './session.query';
import {environment} from '../../../environments/environment';

export const ERR_INVALID_CREDENTIALS = 'Invalid credentials';

export interface Credentials {
  login: string;
  password: string;
}

export interface CheckSessionResponse {
  is_authenticated: boolean;
}


@Injectable({providedIn: 'root'})
export class SessionService {


  constructor(private sessionStore: SessionStore,
              private sessionQuery: SessionQuery,
              private http: HttpClient,
              private csrfToken: HttpXsrfTokenExtractor) {
  }

  checkSessionStatus(): Observable<CheckSessionResponse> {
    return this.http.get<CheckSessionResponse>(environment.backendPath + '/users').pipe(
      tap(result => {
        console.log('User status:', result);
        this.sessionStore.update({
          loggedIn: !!result
        });
      }));
  }

  login(cred: Credentials): Observable<any> {
    console.log('Login with', cred);

    return this.http.post<any>(environment.backendPath + '/sessions', cred).pipe(
      tap(() => {
        this.sessionStore.update({
          loggedIn: true
        });
      })
    );
  }


  logout(): Observable<any> {
    return this.must_have_token().pipe(
      switchMap(() => this.http.delete(environment.backendPath + '/sessions')),
      tap(() => {
        console.log('User logged out.');
        this.sessionStore.update({
          loggedIn: false
        });
      }));
  }

  private must_have_token(): Observable<any> {
    if (this.csrfToken.getToken()) {
      return of('');
    }

    throw new Error('missing csrf');
  }
}
