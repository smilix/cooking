import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoriesService} from '../state/categories.service';
import {CategoriesQuery} from '../state/categories.query';
import {CdkDragDrop, CdkDragMove, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import {Category} from '../state/category.model';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {UiStateService} from '../../../shared/global-ui/ui-state.service';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.scss']
})
export class ListCategoriesComponent implements OnInit, OnDestroy {

  sortMode = false;
  updatingSorting = false;
  localCategories: Category[] = [];
  localCategoriesSub?: Subscription;

  constructor(
    public categoriesQuery: CategoriesQuery,
    private categoriesService: CategoriesService,
    private globalUiState: UiStateService,
  ) {
  }


  ngOnInit(): void {
    this.categoriesService.get().subscribe();
  }

  ngOnDestroy(): void {
    this.unSubscribe();
  }

  startSortMode(): void {
    this.sortMode = true;
    this.localCategoriesSub = this.categoriesQuery.bySortIndex$
      .subscribe(catList => this.localCategories = catList);
  }

  private unSubscribe(): void {
    if (this.localCategoriesSub) {
      this.localCategoriesSub.unsubscribe();
      this.localCategoriesSub = undefined;
    }
  }

  applySortChange(): void {
    this.updatingSorting = true;

    const updates: Observable<any>[] = [];
    this.localCategories.forEach(localCat => {
      const category = this.categoriesQuery.getEntity(localCat.id)!;
      if (category.sort_index !== localCat.sort_index) {
        updates.push(this.categoriesService.update(localCat.id, {
          sort_index: localCat.sort_index
        }));
      }
    });

    forkJoin(updates).subscribe({
      next: value => {
        this.sortMode = false;
        this.unSubscribe();
      },
      complete: () => this.updatingSorting = false
    });
  }

  cancelSortChange(): void {
    this.sortMode = false;
    this.unSubscribe();
  }

  drop(event: CdkDragDrop<Category, any>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    this.updateSortIndexAfterSwap(event.previousIndex, event.currentIndex);
    moveItemInArray(this.localCategories, event.previousIndex, event.currentIndex);
  }

  private updateSortIndexAfterSwap(previousIndex: number, newIndex: number, firstRun = true): void {
    const catList = this.localCategories;

    const newItemPosition = catList[newIndex];

    let newSortIndex;
    if (previousIndex > newIndex) {
      // moved up, e.g. 3 -> 1
      const aboveItemSortIndex = newIndex === 0
        ? 0 // there is no item above -> we use 0
        : catList[newIndex - 1].sort_index;

      const diff = Math.floor((newItemPosition.sort_index - aboveItemSortIndex) / 2);
      if (diff < 1) {
        if (!firstRun) {
          throw new Error('not first run');
        }
        this.normalizeOrder();
        this.updateSortIndexAfterSwap(previousIndex, newIndex, false);
        return;
      }
      newSortIndex = aboveItemSortIndex + diff;
    } else {
      // moved down, e.g. 0 -> 1
      if (newIndex === catList.length - 1) {
        newSortIndex = newItemPosition.sort_index + this.categoriesService.SORT_DISTANCE;
      } else {
        const diff = Math.floor((newItemPosition.sort_index - catList[newIndex - 1].sort_index) / 2);
        if (diff < 1) {
          if (!firstRun) {
            throw new Error('not first run');
          }
          this.normalizeOrder();
          this.updateSortIndexAfterSwap(previousIndex, newIndex, false);
          return;
        }
        newSortIndex = newItemPosition.sort_index + diff;
      }
    }

    // don't modify the items from the repository (we must replace it in our array)!
    catList[previousIndex] = {
      ...catList[previousIndex],
      sort_index: newSortIndex
    };
  }

  private normalizeOrder(): void {
    console.log('Normalize sort order of all categories...');

    let sortCounter = this.categoriesService.SORT_DISTANCE;
    this.localCategories.forEach((cat, index) => {
      if (cat.sort_index !== sortCounter) {
        console.log('Update', cat.id, '->', sortCounter);
        // don't modify the items from the repository (we must replace it in our array)!
        this.localCategories[index] = {
          ...cat,
          sort_index: sortCounter
        };
      }
      sortCounter += this.categoriesService.SORT_DISTANCE;
    });
  }

  dragStarted(): void {
    this.globalUiState.disableBodyScroll(true);
  }

  dragEnded(): void {
    this.globalUiState.disableBodyScroll(false);
  }
}
