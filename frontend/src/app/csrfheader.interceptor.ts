import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable()
export class CSRFHeaderInterceptor implements HttpInterceptor {

  constructor(private csrfToken: HttpXsrfTokenExtractor) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.backendPath)) {
      return next.handle(request);
    }

    const token = this.csrfToken.getToken();
    if (token) {
      request = request.clone({
        headers: new HttpHeaders({
          'X-XSRF-TOKEN': token
        })
      });
    }

    return next.handle(request);
  }
}
