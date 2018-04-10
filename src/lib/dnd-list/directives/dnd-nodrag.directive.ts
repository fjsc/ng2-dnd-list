import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[dndNodrag]',
})
export class DndNodragDirective {

  @HostBinding('draggable')
  get draggable() {
    return true;
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event) {
    event = event.originalEvent || event;
    if (!event._dndHandle) {
      // If a child element already reacted to dragstart and set a dataTransfer object, we will
      // allow that. For example, this is the case for user selections inside of input elements.
      if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
        event.preventDefault();
      }
      event.stopPropagation();
    }
  }

  /**
   * Stop propagation of dragend events, otherwise dnd-moved might be triggered and the element
   * would be removed.
   */
  @HostListener('dragend', ['$event'])
  onDragEnd(event) {
    event = event.originalEvent || event;
    if (!event._dndHandle) {
      event.stopPropagation();
    }
  }
}
