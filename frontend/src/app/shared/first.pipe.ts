import {Pipe, PipeTransform} from '@angular/core';

const SUFFIX = '...';

@Pipe({
  name: 'first'
})
export class FirstPipe implements PipeTransform {

  transform(value: any | null, chars: number): string | null {
    if (!value) {
      return value;
    }

    const strValue = value.toString();
    if (strValue.length <= chars) {
      return strValue;
    }

    return strValue.substr(0, chars - SUFFIX.length) + SUFFIX;
  }
}
