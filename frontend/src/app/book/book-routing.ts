import {RouterModule, Routes} from '@angular/router';
import {ListCategoriesComponent} from './categories/list-categories/list-categories.component';
import {ShowCategoryComponent} from './categories/show-category/show-category.component';
import {NgModule} from '@angular/core';
import {ShowRecipeComponent} from './recipes/show-recipe/show-recipe.component';

const routes: Routes = [
  {path: '', component: ListCategoriesComponent},
  {path: ':id', component: ShowCategoryComponent},
  {path: ':id/:recipeId', component: ShowRecipeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class BookRoutingModule {
}
