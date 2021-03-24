import {Injectable} from '@angular/core';
import {NgEntityService, NgEntityServiceConfig} from '@datorama/akita-ng-entity-service';
import {RecipesState, RecipesStore} from './recipes.store';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {tap} from 'rxjs/operators';
import {Recipe} from './recipe.model';

@NgEntityServiceConfig({
  resourceName: 'recipes',
})
@Injectable({providedIn: 'root'})
export class RecipesService extends NgEntityService<RecipesState> {

  constructor(
    protected store: RecipesStore,
  ) {
    super(store);
  }

  uploadImage(photo: File, recipeId: number): Observable<any> {
    const url = `${environment.backendPath}/recipes/${recipeId}/photo`;

    const uploadData = new FormData();
    uploadData.append('upload', photo, photo.name ?? 'unkown.jpg');

    return this.getHttp().post<Recipe>(url, uploadData).pipe(
      tap(result => this.store.replace(result.id, result))
    );
  }
}
