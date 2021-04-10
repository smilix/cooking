import {InjectionToken, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {environment} from '../environments/environment';
import {NG_ENTITY_SERVICE_CONFIG} from '@datorama/akita-ng-entity-service';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {HttpForbiddenInterceptor} from './session/http-forbidden-interceptor.service';
import {CSRFHeaderInterceptor} from './csrfheader.interceptor';
import {SharedModule} from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,

    // HttpClientXsrfModule.withOptions({
    //   cookieName: 'XSRF-TOKEN',
    //   headerName: 'X-XSRF-TOKEN'
    // }),
    MatListModule,
    SharedModule,
  ],
  providers: [
    {
      provide: NG_ENTITY_SERVICE_CONFIG,
      useValue: {baseUrl: environment.backendPath}
    },
    {provide: HTTP_INTERCEPTORS, useClass: HttpForbiddenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CSRFHeaderInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
