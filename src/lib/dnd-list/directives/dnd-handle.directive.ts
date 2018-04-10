import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[dndHandle]',
})
export class DndHandleDirective {

  @HostBinding('draggable')
  get draggable() {
    return true;
  }

  @HostListener('dragstart dragend', ['$event'])
  onDragStart(event) {
    event = event.originalEvent || event;
    event._dndHandle = true;
  }
}
