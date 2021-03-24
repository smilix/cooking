import { Injectable } from '@angular/core';
import {NgEntityService, NgEntityServiceConfig} from '@datorama/akita-ng-entity-service';
import { CategoriesStore, CategoriesState } from './categories.store';

@NgEntityServiceConfig({
  resourceName: 'categories',
})
@Injectable({ providedIn: 'root' })
export class CategoriesService extends NgEntityService<CategoriesState> {

  // TODO: eigene Subklasse von NgEntityService mit Caching

  constructor(protected store: CategoriesStore) {
    super(store);
  }

}
