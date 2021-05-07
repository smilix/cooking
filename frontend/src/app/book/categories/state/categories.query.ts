import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {CategoriesState, CategoriesStore} from './categories.store';
import {Observable} from 'rxjs';
import {Category} from './category.model';

@Injectable({providedIn: 'root'})
export class CategoriesQuery extends QueryEntity<CategoriesState> {

  readonly bySortIndex$ = this.selectAll({
    sortBy: 'sort_index'
  });

  constructor(protected store: CategoriesStore) {
    super(store);
  }

  bySortIndex(): Category[] {
    return this.getAll({
      sortBy: 'sort_index'
    });
  }

}
