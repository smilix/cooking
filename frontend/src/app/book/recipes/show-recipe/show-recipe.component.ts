import {Component, OnInit} from '@angular/core';
import {RecipesQuery} from '../state/recipes.query';
import {RecipesService} from '../state/recipes.service';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize, switchMap} from 'rxjs/operators';
import {Recipe} from '../state/recipe.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {combineLatest, of} from 'rxjs';
import {CategoriesService} from '../../categories/state/categories.service';
import {CategoriesQuery} from '../../categories/state/categories.query';
import {Category} from '../../categories/state/category.model';
import {ConfirmService} from '../../../shared/confirm/confirm.component';
import {ViewportScroller} from '@angular/common';

@Component({
  selector: 'app-show-recipe',
  templateUrl: './show-recipe.component.html',
  styleUrls: ['./show-recipe.component.scss']
})
export class ShowRecipeComponent implements OnInit {

  recipe?: Recipe;
  category?: Category;

  newMode = false;
  uploading = false;
  sourceIsLink = false;
  form: FormGroup | null = null;

  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public categoriesQuery: CategoriesQuery,
    private categoriesService: CategoriesService,
    private recipesQuery: RecipesQuery,
    private recipesService: RecipesService,
    private confirmService: ConfirmService,
  ) {
  }

  ngOnInit(): void {
    this.categoriesService.get().subscribe();
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const categoryId = parseInt(params.get('id')!, 10);
        const id = params.get('recipeId');
        this.newMode = id === 'new';
        if (this.newMode) {
          return combineLatest([
            this.categoriesQuery.selectEntity(categoryId),
            of({} as Recipe)
          ]);
        }
        this.recipesService.get(id).subscribe();

        return combineLatest([
          this.categoriesQuery.selectEntity(categoryId),
          this.recipesQuery.selectEntity(id)
        ]);
      })
    ).subscribe(([category, r]) => {
      // console.log('loaded', category, r);
      this.category = category;
      this.recipe = r;
      this.sourceIsLink = r?.source?.startsWith('http') ?? false;
      if (this.newMode) {
        this.startEdit();
      }
    });
  }

  startEdit(): void {
    this.form = this.fb.group({
      name: [this.recipe?.name, Validators.required],
      sub_title: [this.recipe?.sub_title],
      ingredients: [this.recipe?.ingredients],
      description: [this.recipe?.description],
      source: [this.recipe?.source],
      category_id: [this.category?.id, Validators.required]
    });
  }

  cancelEdit(): void {
    this.form = null;
  }

  save(): void {
    if (!this.form) {
      return;
    }

    console.log(this.form.value);

    const model = {
      ...this.form.value,
    } as Recipe;
    if (this.newMode) {
      this.recipesService.add<Recipe>(model).subscribe(newRecipe => {
        this.form = null;
        this.router.navigate(['../', newRecipe.id], {relativeTo: this.activatedRoute});
      });
    } else {
      this.recipesService.update(this.recipe!!.id, model).subscribe(() => {
        this.form = null;
      });
    }
  }

  startUpload(input: any): void {
    if (!this.recipe) {
      return;
    }
    this.uploading = true;
    this.viewportScroller.scrollToPosition([0, 0]);

    const file = input.files[0];
    console.log(file);

    this.recipesService.uploadImage(file, this.recipe.id).pipe(
      finalize(() => this.uploading = false)
    ).subscribe();
  }

  delete(): void {
    if (!this.recipe) {
      return;
    }
    this.confirmService.showConfirm(`'${this.recipe.name}' wird gelöscht.`, 'Löschen').subscribe(
      result => {
        if (result) {
          this.recipesService.delete(this.recipe!.id).subscribe(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
          });
        }
      }
    );
  }

  mark(): void {
    if (!this.recipe) {
      return;
    }
    this.recipesService.update(this.recipe!.id, {
      marked: !this.recipe!.marked
    }).subscribe();
  }
}
