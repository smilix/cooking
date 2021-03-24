import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RecipesStore, RecipesState } from './recipes.store';

@Injectable({ providedIn: 'root' })
export class RecipesQuery extends QueryEntity<RecipesState> {

  constructor(protected store: RecipesStore) {
    super(store);
  }

}
