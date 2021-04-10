import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FirstPipe} from './first.pipe';
import {RecipeImgPipe} from './recipe-img.pipe';
import {MarkdownPipe} from './markdown.pipe';
import {ConfirmComponent, ConfirmService} from './confirm/confirm.component';
import {MatButtonModule} from '@angular/material/button';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {WaitingComponent} from './waiting/waiting.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SearchComponent, SearchService} from './search/search.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReactiveFormsModule} from '@angular/forms';
import {OverlayModule} from '@angular/cdk/overlay';
import {A11yModule} from '@angular/cdk/a11y';


@NgModule({
  declarations: [FirstPipe, RecipeImgPipe, MarkdownPipe, ConfirmComponent, WaitingComponent, SearchComponent],
  exports: [
    FirstPipe,
    RecipeImgPipe,
    MarkdownPipe,
    WaitingComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    OverlayModule,
  ],
  providers: [
    ConfirmService,
    SearchService,
  ],
  entryComponents: [
    ConfirmComponent
  ]
})
export class SharedModule { }
