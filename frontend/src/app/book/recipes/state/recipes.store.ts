import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Recipe} from './recipe.model';

export interface RecipesState extends EntityState<Recipe> {
}

@Injectable({providedIn: 'root'})
@StoreConfig({
  name: 'recipes',
  cache: {ttl: 3600000} // 1 hour in ms
})
export class RecipesStore extends EntityStore<RecipesState> {

  constructor() {
    super();
  }

}
