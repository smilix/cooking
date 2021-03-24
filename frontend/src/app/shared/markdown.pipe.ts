import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

declare function marked(s: any, options: any): string;

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value) {
      return value;
    }

    // https://marked.js.org/using_advanced
    const html = marked(value, {
      gfm: true,
      breaks: true,
    });

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
