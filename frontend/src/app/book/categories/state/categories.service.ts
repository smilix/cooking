import {Injectable} from '@angular/core';
import {NgEntityServiceConfig} from '@datorama/akita-ng-entity-service';
import {CategoriesState, CategoriesStore} from './categories.store';
import {CategoriesQuery} from './categories.query';
import {CachingNgEntityService} from '../../../shared/caching-ng-entity-service';

@NgEntityServiceConfig({
  resourceName: 'categories',
})
@Injectable({providedIn: 'root'})
export class CategoriesService extends CachingNgEntityService<CategoriesState> {

  constructor(
    store: CategoriesStore,
    categoriesQuery: CategoriesQuery,
  ) {
    super(store, categoriesQuery);
  }
}
