import {AfterViewInit, Component, ElementRef, Injectable, OnInit, ViewChild} from '@angular/core';
import {CategoriesQuery} from '../../book/categories/state/categories.query';
import {RecipesQuery} from '../../book/recipes/state/recipes.query';
import {combineLatest, Observable} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {filter, map, startWith, tap} from 'rxjs/operators';
import {CategoriesService} from '../../book/categories/state/categories.service';
import {RecipesService} from '../../book/recipes/state/recipes.service';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete/autocomplete';
import {Router} from '@angular/router';
import {MatInput} from '@angular/material/input';

interface SearchRecipe {
  id: number;
  name: string;
}

interface SearchCategory {
  id: number;
  name: string;
  recipes: SearchRecipe[];
}


interface DataExchange {
  onSelected(categoryId: number, recipeId: number): void;

  onCancel(): void;
}


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

  // set by service
  callback!: DataExchange;

  searchData!: Observable<SearchCategory[]>;

  form = this.formBuilder.group({
    search: ''
  });

  @ViewChild('searchInput')
  searchInput!: ElementRef<MatInput>;

  constructor(
    private formBuilder: FormBuilder,
    private categoriesQuery: CategoriesQuery,
    private recipesQuery: RecipesQuery,
    private categoriesService: CategoriesService,
    private recipesService: RecipesService,
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.searchInput.nativeElement.focus());
  }

  private loadData(): void {
    this.categoriesService.get().subscribe();
    this.recipesService.get().subscribe();

    const rawSearchData$ = combineLatest([
      this.categoriesQuery.selectAll().pipe(tap(x => console.log('cat query'))),
      this.recipesQuery.selectAll().pipe(tap(x => console.log('recipe query')))
    ]).pipe(
      filter(([categories, recipes]) => categories.length > 0 && recipes.length > 0),
      map(([categories, recipes]) => {
        console.log('do the map for', categories.length, recipes.length);

        const recipesMap = new Map<number, SearchRecipe[]>();
        recipes.forEach(r => {
          if (!r.category_id) {
            return;
          }
          let recipesForCat = recipesMap.get(r.category_id);
          if (!recipesForCat) {
            recipesForCat = [];
            recipesMap.set(r.category_id, recipesForCat);
          }

          recipesForCat.push({
            id: r.id,
            name: r.name,
          } as SearchRecipe);
        });

        const cats: SearchCategory[] = categories.map(c => ({
          id: c.id,
          name: c.name,
          recipes: recipesMap.get(c.id) ?? []
        }));


        return cats;
      }),
    );

    // @ts-ignore
    this.searchData = combineLatest([
      rawSearchData$,
      this.form.get('search')!.valueChanges.pipe(
        startWith(''),
        filter(s => typeof s === 'string'),
        map((s: string) => s.toLowerCase()))
    ]).pipe(
      map(([rawSearchData, searchValue]) => {
        return rawSearchData
          .map(category => {
            const filteredRecipes: SearchRecipe[] = category.recipes
              .filter(recipe => recipe.name.toLowerCase().includes(searchValue));

            if (filteredRecipes.length > 0) {
              return {
                ...category,
                recipes: filteredRecipes
              } as SearchCategory;
            } else {
              return null;
            }
          })
          .filter(entry => entry !== null);
      })
    );
  }

  doSearch(event: MatAutocompleteSelectedEvent): void {
    const [catId, recipeId] = event.option.value;
    this.callback.onSelected(catId, recipeId);
  }
}

@Injectable()
export class SearchService {

  constructor(
    private overlay: Overlay,
    private router: Router
  ) {
  }

  showSearch(): void {
    const ref = this.overlay.create({
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      disposeOnNavigation: true,
      hasBackdrop: true,
      panelClass: 'search-overlay',
    });

    ref.backdropClick().subscribe(() => ref.dispose());
    const componentRef = ref.attach(new ComponentPortal(SearchComponent));
    componentRef.instance.callback = {
      onSelected: (categoryId, recipeId) => {
        ref.dispose();
        this.router.navigate(['/categories', categoryId, recipeId]);
      },
      onCancel: () => {
        ref.dispose();
      }
    };
  }
}
