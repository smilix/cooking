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


@NgModule({
  declarations: [FirstPipe, RecipeImgPipe, MarkdownPipe, ConfirmComponent, WaitingComponent],
  exports: [
    FirstPipe,
    RecipeImgPipe,
    MarkdownPipe,
    WaitingComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    ConfirmService
  ],
  entryComponents: [
    ConfirmComponent
  ]
})
export class SharedModule { }
