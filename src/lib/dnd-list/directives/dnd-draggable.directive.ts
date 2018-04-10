import {
  Directive, HostBinding, OnChanges, SimpleChanges, Input,
  HostListener, ElementRef, Renderer2, Output, EventEmitter
} from '@angular/core';
import { DndDraggableService } from '../services/dnd-draggable.service';
import { MIME_TYPE, EDGE_MIME_TYPE, MSIE_MIME_TYPE, ALL_EFFECTS } from '../dnd-constants';
import { DndDragendEvent } from '../models/events';

@Directive({
  selector: '[dndDraggable]',
})
export class DndDraggableDirective {

  @Input() dndDraggable: any;
  @Input() dndDisable: boolean;
  @Input() dndType = '';
  @Input() dndCallback: Function;
  @Input() dndEffectAllowed: string;

  @Output() dndDragstart = new EventEmitter<DragEvent>();
  @Output() dndDragend = new EventEmitter<DndDragendEvent>();
  @Output() dndSelected = new EventEmitter<Event>();

  @Output() dndMoved = new EventEmitter<DragEvent>();
  @Output() dndCopied = new EventEmitter<DragEvent>();
  @Output() dndLinked = new EventEmitter<DragEvent>();
  @Output() dndCanceled = new EventEmitter<DragEvent>();

  @HostBinding('draggable')
  get draggable() {
    return !this.dndDisable;
  }

  private _nativeElement: Element;

  constructor(private _dndService: DndDraggableService, private _renderer: Renderer2, _hostElement: ElementRef) {
    this._nativeElement = _hostElement.nativeElement;
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event) {
    event = event.originalEvent || event;
    if (!this.draggable) {
      return true;
    }
    this._dndService.setDraggingState(true);
    this._dndService.setItemType(this.dndType);
    const mimeType = MIME_TYPE + (this._dndService.getItemType() ? ('-' + this._dndService.getItemType()) : '');
    // Set the allowed drop effects. See below for special IE handling.
    this._dndService.setDropEffect('none');
    this._dndService.setEffectAllowed(this.dndEffectAllowed || ALL_EFFECTS[0]);

    event.dataTransfer.effectAllowed = this._dndService.getEffectAllowed(); // TODO: set allowed effects
    try {
      event.dataTransfer.setData(mimeType, JSON.stringify(this.dndDraggable));
    } catch (e) {
      const data = {
        item: this.dndDraggable,
        type: this._dndService.getItemType()
      };

      try {
        // Setting a custom MIME type did not work, we are probably in IE or Edge.
        event.dataTransfer.setData(EDGE_MIME_TYPE, JSON.stringify(data));

      } catch (e) {
        // We are in Internet Explorer and can only use the Text MIME type. Also note that IE
        // does not allow changing the cursor in the dragover event, therefore we have to choose
        // the one we want to display now by setting effectAllowed.
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData(MSIE_MIME_TYPE, JSON.stringify(data));
      }
    }
    this._renderer.addClass(this._nativeElement, 'dndDragging');
    setTimeout(() => this._renderer.addClass(this._nativeElement, 'dndDraggingSource'), 0);
    // Try setting a proper drag image if triggered on a dnd-handle (won't work in IE).
    if (event._dndHandle && event.dataTransfer.setDragImage) {
      event.dataTransfer.setDragImage(this._nativeElement, 0, 0);
    }
    // Emit dragstart event and prepare extra callback for dropzone.
    this.dndDragstart.emit(event);

    if (this.dndCallback) {
      const callback = this.dndCallback;
      this._dndService.setDropCallback(function (params) {
        return callback(params);
      });
    }
    event.stopPropagation();
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    const dropEffect = this._dndService.getDropEffect();
    const cb = { copy: 'dndCopied', link: 'dndLinked', move: 'dndMoved', none: 'dndCanceled' };
    this[cb[dropEffect]].emit(event);
    this.dndDragend.emit({
      event: event,
      dropEffect: dropEffect
    });

    // Clean up
    this._dndService.setDraggingState(false);
    this._dndService.setDropCallback(undefined);
    this._dndService.setRemoveOnDrop(false);
    this._renderer.removeClass(this._nativeElement, 'dndDragging');
    this._renderer.removeClass(this._nativeElement, 'dndDraggingSource');
    event.stopPropagation();

    // In IE9 it is possible that the timeout from dragstart triggers after the dragend handler.
    setTimeout(() => this._renderer.removeClass(this._nativeElement, 'dndDraggingSource'), 0);
  }

  @HostListener('click', ['$event'])
  click(event: MouseEvent) {
    this.dndSelected.emit(event);
    // Prevent triggering dndSelected in parent elements.
    event.stopPropagation();
  }

}
