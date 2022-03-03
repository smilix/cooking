import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SessionModule} from './session/session.module';
import {BookModule} from './book/book.module';
import {SearchModule} from './search/search.module';

const routes: Routes = [
  {path: 'session', loadChildren: () => SessionModule},
  {path: 'categories', loadChildren: () => BookModule},
  {path: 'search', loadChildren: () => SearchModule},
  {
    path: '',
    redirectTo: '/categories',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
