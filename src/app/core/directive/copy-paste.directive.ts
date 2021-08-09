import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appCopyPaste]'
})
export class CopyPasteDirective {

  constructor() {
   }

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

}
