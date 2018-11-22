import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
    private regex: RegExp = new RegExp(/[0-9]/g);
    // Allow key codes for special events. Reflect :
    private specialKeys: Array<number> = [46, 8, 9, 27, 13, 110, 190, 35, 36, 37, 39];
    // Backspace, tab, end, home

    @Input() maxlength = 3;
    @Input() min = 1;
    @Input() max = 1000;

    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
       const e = <KeyboardEvent>event;

        if ((
            (this.specialKeys.indexOf(event.which) > -1) ||

            (e.which === 65 && e.ctrlKey === true) ||

            (e.which === 67 && e.ctrlKey === true) ||

            (e.which === 88 && e.ctrlKey === true))) {
            return;
        } else if (
            (e.which >= 48 && e.which <= 57) ||

            (event.which >= 96 && event.which <= 105)) {

             } else {
            event.preventDefault();
        }
        const current: string = this.el.nativeElement.value;

        const next: string = current.concat(event.key);
        if ((next && !String(next).match(this.regex)) ||
            (this.maxlength && next.length > this.maxlength) ||
            (this.min && +next < this.min) ||
            (this.max && +next >= this.max)) {
            event.preventDefault();
        }

    }
}
