import {Pipe, PipeTransform} from '@angular/core';
import {HttpXsrfTokenExtractor} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Recipe} from '../book/recipes/state/recipe.model';

@Pipe({
  name: 'recipeImg'
})
export class RecipeImgPipe implements PipeTransform {

  constructor(private csrfToken: HttpXsrfTokenExtractor) {
  }

  transform(recipe?: Recipe, size?: number): unknown {
    if (!recipe) {
      return;
    }
    size = size ?? 300;
    if (recipe.photo) {
      return environment.backendPath + `/recipes/${recipe.id}/photo?size=${size}&X-XSRF-TOKEN=${this.csrfToken.getToken()}&nc=${recipe.photo}`;
    }
    return '/assets/molumen_couvert.svg';
  }

}
