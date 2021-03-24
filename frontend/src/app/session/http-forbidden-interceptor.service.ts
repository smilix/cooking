import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {SessionQuery} from './state/session.query';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

@Injectable()
export class HttpForbiddenInterceptor implements HttpInterceptor {

  private readonly LOGIN_URL = environment.backendPath + '/session';

  constructor(private sessionQuery: SessionQuery,
              private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.backendPath) || request.url === this.LOGIN_URL) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          console.log('No session or token');
          this.router.navigate(['/session/']); // {route: this.router.url}
          return throwError(err);
        }
        return throwError(err);
      }));
  }
}
