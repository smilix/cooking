import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {RecipesService} from '../../book/recipes/state/recipes.service';
import {RecipesQuery} from '../../book/recipes/state/recipes.query';
import {Recipe} from '../../book/recipes/state/recipe.model';
import {CategoriesService} from '../../book/categories/state/categories.service';
import {forkJoin} from 'rxjs';
import {Category} from '../../book/categories/state/category.model';
import {CategoriesQuery} from '../../book/categories/state/categories.query';

interface SearchResultItem {
  recipe: Recipe;
  category: Category;
}

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  searchFor = '';
  result: SearchResultItem[] | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private recipesService: RecipesService,
    private recipesQuery: RecipesQuery,
    private categoriesService: CategoriesService,
    private categoriesQuery: CategoriesQuery,
  ) {
  }

  ngOnInit(): void {
    forkJoin([this.recipesService.get(), this.categoriesService.get()]).pipe(
      switchMap(() => this.activatedRoute.queryParamMap),
      switchMap(qParams => {
        this.searchFor = qParams.get('q') ?? '';

        const lowerSearchFor = this.searchFor.toLowerCase();
        return this.recipesQuery.selectAll({
          filterBy: r => r.name.toLowerCase().includes(lowerSearchFor)
            || (r.sub_title?.toLowerCase().includes(lowerSearchFor) ?? false)
            || r.ingredients.toLowerCase().includes(lowerSearchFor)
            || r.description.toLowerCase().includes(lowerSearchFor)
            || (r.source?.toLowerCase().includes(lowerSearchFor) ?? false)
        });
      }),
    ).subscribe(recipes => {
      this.result = recipes.map(recipe => {
        return {
          recipe,
          category: this.categoriesQuery.getEntity(recipe.category_id)!
        };
      });
    });
  }

  doFullTextSearch(value: string): void {
    console.log('doFullTextSearch', value);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        q: value
      }
    });
  }
}
