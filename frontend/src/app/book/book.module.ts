import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes} from '@angular/router';
import {ListCategoriesComponent} from './categories/list-categories/list-categories.component';
import {ShowCategoryComponent} from './categories/show-category/show-category.component';
import {BookRoutingModule} from './book-routing';
import {ShowRecipeComponent} from './recipes/show-recipe/show-recipe.component';
import {SharedModule} from '../shared/shared.module';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatRippleModule} from '@angular/material/core';

const routes: Routes = [
  {path: '', component: ListCategoriesComponent},
  {path: ':id', component: ShowCategoryComponent}
];

@NgModule({
  declarations: [
    ListCategoriesComponent,
    ShowCategoryComponent,
    ShowRecipeComponent,
  ],
  imports: [
    CommonModule,
    BookRoutingModule,
    SharedModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRippleModule,
  ]
})
export class BookModule {
}
