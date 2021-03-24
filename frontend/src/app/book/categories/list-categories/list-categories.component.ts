import {Component, OnInit} from '@angular/core';
import {CategoriesService} from '../state/categories.service';
import {CategoriesQuery} from '../state/categories.query';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.scss']
})
export class ListCategoriesComponent implements OnInit {

  constructor(
    public categoriesQuery: CategoriesQuery,
    private categoriesService: CategoriesService,
  ) {
  }

  ngOnInit(): void {
    this.categoriesService.get().subscribe();
  }

}
