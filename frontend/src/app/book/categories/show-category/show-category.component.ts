import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {CategoriesService} from '../state/categories.service';
import {RecipesService} from '../../recipes/state/recipes.service';
import {RecipesQuery} from '../../recipes/state/recipes.query';
import {combineLatest, of} from 'rxjs';
import {Category} from '../state/category.model';
import {Recipe} from '../../recipes/state/recipe.model';
import {CategoriesQuery} from '../state/categories.query';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfirmService} from '../../../shared/confirm/confirm.component';

@Component({
  selector: 'app-show-category',
  templateUrl: './show-category.component.html',
  styleUrls: ['./show-category.component.scss']
})
export class ShowCategoryComponent implements OnInit {

  category = {} as Category;
  recipes: Recipe[] = [];

  newMode = false;
  form: FormGroup | null = null;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService,
    private categoriesQuery: CategoriesQuery,
    public recipesQuery: RecipesQuery,
    private recipesService: RecipesService,
    private confirmService: ConfirmService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const idValue = params.get('id');
        this.newMode = idValue === 'new';
        if (this.newMode) {
          return of([{} as Category, [] as Recipe[]]);
        } else {
          const id = parseInt(idValue!!, 10);
          this.categoriesService.get().subscribe();
          this.recipesService.get().subscribe();

          return combineLatest([
            this.categoriesQuery.selectEntity(id),
            this.recipesQuery.selectAll({
              filterBy: (r => r.category_id === id)
            })
          ]);
        }
      })
    ).subscribe(([category, recipes]) => {
      // console.log('loaded:', category, recipes);
      // @ts-ignore
      this.category = category;
      // @ts-ignore
      this.recipes = recipes;

      if (this.newMode) {
        this.startEdit();
      }
    });
  }

  startEdit(): void {
    this.form = this.fb.group({
      name: [this.category.name, Validators.required],
      description: [this.category.description],
    });
  }


  cancelEdit(): void {
    this.form = null;
    if (this.newMode) {
      this.router.navigate(['/categories']);
    }
  }

  save(): void {
    if (!this.form) {
      return;
    }

    console.log(this.form.value);

    if (this.newMode) {
      const model = {
        ...this.form.value,
      } as Category;
      this.categoriesService.add<Category>(model).subscribe(newCategory => {
        this.form = null;
        this.router.navigate(['../', newCategory.id], {relativeTo: this.activatedRoute});
      });
    } else {
      this.categoriesService.update(this.category.id, this.form.value).subscribe(() => {
        this.form = null;
      });
    }
  }

  delete(): void {
    this.confirmService.showConfirm(`'${this.category.name}' wird gel??scht.`, 'L??schen').subscribe(
      result => {
        if (result) {
          this.categoriesService.delete(this.category.id).subscribe(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
          });
        }
      }
    );
  }
}
