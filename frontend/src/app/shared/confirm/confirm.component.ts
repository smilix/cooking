import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

interface ConfirmData {
  text: string;
  okLabel: string;
  cancelLabel: string;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    public bottomSheetRef: MatBottomSheetRef,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ConfirmData
  ) {
  }

  ngOnInit(): void {
  }

}

@Injectable()
export class ConfirmService {

  constructor(private bottomSheet: MatBottomSheet) {
  }

  showConfirm(text: string, okLabel: string = 'OK', cancelLabel: string = 'Abbrechen'): Observable<boolean> {
    return this.bottomSheet.open(ConfirmComponent, {
      data: {
        text,
        okLabel,
        cancelLabel
      } as ConfirmData
    }).afterDismissed();
  }
}
