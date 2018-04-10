import {
   Directive,
   HostBinding,
   OnChanges,
   Input,
   HostListener,
   ElementRef,
   Renderer2,
   OnInit,
   Output,
   EventEmitter
} from '@angular/core';
import { DndDraggableService } from '../services/dnd-draggable.service';
import { MSIE_MIME_TYPE, EDGE_MIME_TYPE, MIME_TYPE, ALL_EFFECTS } from '../dnd-constants';
import { DndListEvent } from '../models/events';

@Directive({
   selector: '[dndList]',
})
export class DndListDirective implements OnInit {
   @Input() dndDisable = false;
   @Input() dndAllowedTypes: String[];
   @Input() dndExternalSources: any;
   @Input() dndHorizontalList: any;
   @Input() dndEffectAllowed: string;
   @Input() pureComponent: boolean;
   @Input() dndList: any;

   @Output() dndListChange = new EventEmitter<any>();

   @Output() dndDragover = new EventEmitter<DndListEvent>();
   @Output() dndDrop = new EventEmitter<DndListEvent>();
   @Output() dndInserted = new EventEmitter<DndListEvent>();

   private _nativeElement: Element;
   private _placeholderNode: Element;

   private _listSettings: any = {};
   private _listNode: any;
   private _dragOverStopped = false;

   private _counter = 0;

   constructor(private _el: ElementRef, private _renderer: Renderer2, private _dndService: DndDraggableService) {
      this._nativeElement = this._el.nativeElement;
   }

   ngOnInit(): void {
      const placeholder = this._getPlaceholderElement();
      placeholder.remove();
      this._placeholderNode = placeholder;
      this._listNode = this._nativeElement;
   }

   @HostListener('dragenter', ['$event'])
   onDragEnter(event) {
      this._counter++;
      this._dragOverStopped = false;
      event = event.originalEvent || event;
      this._listSettings = {
         allowedTypes: Array.isArray(this.dndAllowedTypes) && this.dndAllowedTypes.join('|').toLowerCase().split('|'),
         disabled: this.dndDisable,
         externalSources: this.dndExternalSources,
         horizontal: this.dndHorizontalList
      };
      const mimeType = this._getMimeType(event.dataTransfer.types);
      if (!mimeType || !this._isDropAllowed(this._getItemType(mimeType))) {
         return true;
      }
      event.preventDefault();
   }

   @HostListener('dragover', ['$event'])
   onDragOver(event) {
      event = event.originalEvent || event;
      // Check whether the drop is allowed and determine mime type.
      const mimeType = this._getMimeType(event.dataTransfer.types);
      const itemType = this._getItemType(mimeType);
      if (!mimeType || !this._isDropAllowed(itemType)) {
         return true;
      }
      // Make sure the placeholder is shown, which is especially important if the list is empty.
      if (this._placeholderNode.parentNode !== this._listNode) {
         this._renderer.appendChild(this._nativeElement, this._placeholderNode);
      }

      if (event.target !== this._listNode) {
         // Try to find the node direct directly below the list node.
         let listItemNode = event.target;
         while (listItemNode.parentNode !== this._listNode && listItemNode.parentNode) {
            listItemNode = listItemNode.parentNode;
         }

         if (listItemNode.parentNode === this._listNode && listItemNode !== this._placeholderNode) {
            // If the mouse pointer is in the upper half of the list item element,
            // we position the placeholder before the list item, otherwise after it.
            const rect = listItemNode.getBoundingClientRect();
            let isFirstHalf;
            if (this._listSettings.horizontal) {
               isFirstHalf = event.clientX < rect.left + rect.width / 2;
            } else {
               isFirstHalf = event.clientY < rect.top + rect.height / 2;
            }
            this._listNode.insertBefore(this._placeholderNode,
               isFirstHalf ? listItemNode : listItemNode.nextSibling);
         }
      }

      // In IE we set a fake effectAllowed in dragstart to get the correct cursor, we therefore
      // ignore the effectAllowed passed in dataTransfer. We must also not access dataTransfer for
      // drops from external sources, as that throws an exception.
      const ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
      const dropEffect = this._getDropEffect(event, ignoreDataTransfer);

      if (dropEffect === 'none') {
         return this._stopDragover();
      }
      // At this point we invoke the callback, which still can disallow the drop.
      // We can't do this earlier because we want to pass the index of the placeholder.

      this.dndDragover.emit(this._getEventResponse(event, dropEffect, itemType));
      if (this._dragOverStopped) {
         return this._stopDragover();
      }

      // Set dropEffect to modify the cursor shown by the browser, unless we're in IE, where this
      // is not supported. This must be done after preventDefault in Firefox.
      event.preventDefault();
      if (!ignoreDataTransfer) {
         event.dataTransfer.dropEffect = dropEffect;
      }

      this._renderer.addClass(this._nativeElement, 'dndDragover');
      event.stopPropagation();
      return false;
   }

   @HostListener('drop', ['$event'])
   onDrop(event) {
      this._counter = 0;
      event = event.originalEvent || event;
      // Check whether the drop is allowed and determine mime type.
      const mimeType = this._getMimeType(event.dataTransfer.types);
      let itemType = this._getItemType(mimeType);
      if (!mimeType || !this._isDropAllowed(itemType)) {
         return true;
      }
      // The default behavior in Firefox is to interpret the dropped element as URL and
      // forward to it. We want to prevent that even if our drop is aborted.
      event.preventDefault();

      // Unserialize the data that was serialized in dragstart.
      let data;
      try {
         data = JSON.parse(event.dataTransfer.getData(mimeType));
      } catch (e) {
         return this._stopDragover();
      }

      // Drops with invalid types from external sources might not have been filtered out yet.
      if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE) {
         itemType = data.type || undefined;
         data = data.item;
         if (!this._isDropAllowed(itemType)) {
            return this._stopDragover();
         }
      }

      // Special handling for internal IE drops, see dragover handler.
      const ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
      const dropEffect = this._getDropEffect(event, ignoreDataTransfer);
      if (dropEffect === 'none') {
         return this._stopDragover();
      }
      // Invoke the callback, which can transform the transferredObject and even abort the drop.
      const index = this._getPlaceholderIndex();
      this.dndDrop.emit(this._getEventResponse(event, dropEffect, itemType, index, data));
      if (this._dragOverStopped) {
         return this._stopDragover();
      }

      // The drop is definitely going to happen now, store the dropEffect.
      this._dndService.setDropEffect(dropEffect);
      if (!ignoreDataTransfer) {
         event.dataTransfer.dropEffect = dropEffect;
      }

      if (this.dndList && this.dndList.length) {
         // Creates a new array adding the object into the array position without mutate the original.
         const newList = [...this.dndList.slice(0, index), data, ...this.dndList.slice(index)];
         this.dndListChange.emit(newList);
      }

      this._dndService.setRemoveOnDrop(true);
      // this._dndService.dropEndSource()

      this.dndInserted.emit(this._getEventResponse(event, dropEffect, itemType, index, data));

      // Clean up
      this._stopDragover();
      event.stopPropagation();
      return false;
   }

   /**
  * We have to remove the placeholder when the element is no longer dragged over our list. The
  * problem is that the dragleave event is not only fired when the element leaves our list,
  * but also when it leaves a child element. Therefore, we determine whether the mouse cursor
  * is still pointing to an element inside the list or not.
  */
   @HostListener('dragleave', ['$event'])
   onDragLeave(event) {
      this._counter--;
      event = event.originalEvent || event;
      if (this._counter !== 0) {
         // Signalize to potential parent lists that a placeholder is already shown.
         event._dndPhShown = true;
      } else {
         this._stopDragover();
      }
   }

   @HostListener('mouseleave', ['$event'])
   onmouseout(event) {
      if (this._dndService.getDraggingState()) {
         this._stopDragover();
      }
   }

   private _stopDrag() {
      this._dragOverStopped = true;
   }

   private _stopDragover() {
      this._placeholderNode.remove();
      this._renderer.removeClass(this._nativeElement, 'dndDragover');
      return true;
   }


   /**
  * Create a DndListEvent instance for events response.
  */
   private _getEventResponse(event: DragEvent, dropEffect: string, itemType: string, index?: number, item?): DndListEvent {
      return {
         callback: this._dndService.getDropCallback(),
         dropEffect: dropEffect,
         event: event,
         external: !this._dndService.getDraggingState(),
         index: index !== undefined ? index : this._getPlaceholderIndex(),
         item: item || undefined,
         stopDragover: this._stopDrag.bind(this),
         type: itemType
      };
   }

   private _getPlaceholderIndex() {
      return Array.prototype.indexOf.call(this._nativeElement.children, this._placeholderNode);
   }

   private _getPlaceholderElement(): Element {
      let placeholder = [].slice.call(this._nativeElement.children).filter((childNode) => {
         return childNode.className.indexOf('dndPlaceholder') > -1;
      });
      if (placeholder.length) {
         return placeholder;
      }
      placeholder = this._renderer.createElement('li');
      this._renderer.addClass(placeholder, 'dndPlaceholder');
      return placeholder;
   }

   private _getMimeType(types) {
      if (!types) {
         return MSIE_MIME_TYPE; // IE 9 workaround.
      }
      for (let i = 0; i < types.length; i++) {
         if (types[i] === MSIE_MIME_TYPE || types[i] === EDGE_MIME_TYPE ||
            types[i].substr(0, MIME_TYPE.length) === MIME_TYPE) {
            return types[i];
         }
      }
      return null;
   }

   /**
  * Determines the type of the item from the dndService, or from the mime type for items from
  * external sources. Returns undefined if no item type was set and null if the item type could
  * not be determined.
  */
   private _getItemType(mimeType) {
      if (this._dndService.getDraggingState()) {
         return this._dndService.getItemType() || undefined;
      }
      if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE) {
         return null;
      }
      return (mimeType && mimeType.substr(MIME_TYPE.length + 1)) || undefined;
   }

   private _isDropAllowed(itemType) {
      if (this._listSettings.disabled) {
         return false;
      }
      if (!this._listSettings.externalSources && !this._dndService.getDraggingState()) {
         return false;
      }
      if (!this._listSettings.allowedTypes || itemType === null) {
         return true;
      }
      return itemType && this._listSettings.allowedTypes.indexOf(itemType) !== -1;
   }

   /**
  * Determines which drop effect to use for the given event. In Internet Explorer we have to
  * ignore the effectAllowed field on dataTransfer, since we set a fake value in dragstart.
  * In those cases we rely on dndState to filter effects. Read the design doc for more details:
  * https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
  */
   private _getDropEffect(event, ignoreDataTransfer) {
      let effects = ALL_EFFECTS;
      if (!ignoreDataTransfer) {
         effects = this._filterEffects(effects, event.dataTransfer.effectAllowed);
      }
      if (this._dndService.getDraggingState()) {
         effects = this._filterEffects(effects, this._dndService.getEffectAllowed());
      }
      if (this.dndEffectAllowed) {
         effects = this._filterEffects(effects, this.dndEffectAllowed);
      }
      // MacOS automatically filters dataTransfer.effectAllowed depending on the modifier keys,
      // therefore the following modifier keys will only affect other operating systems.
      if (!effects.length) {
         return 'none';
      } else if (event.ctrlKey && effects.indexOf('copy') !== -1) {
         return 'copy';
      } else if (event.altKey && effects.indexOf('link') !== -1) {
         return 'link';
      } else {
         return effects[0];
      }
   }

   /**
  * Filters an array of drop effects using a HTML5 effectAllowed string.
  */
   private _filterEffects(effects, effectAllowed) {
      if (effectAllowed === 'all') {
         return effects;
      }
      return effects.filter(function (effect) {
         return effectAllowed.toLowerCase().indexOf(effect) !== -1;
      });
   }
}
