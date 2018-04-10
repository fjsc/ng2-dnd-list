import { ElementRef, Renderer2, OnInit, EventEmitter } from '@angular/core';
import { DndDraggableService } from '../services/dnd-draggable.service';
import { DndListEvent } from '../models/events';
export declare class DndListDirective implements OnInit {
    private _el;
    private _renderer;
    private _dndService;
    dndDisable: boolean;
    dndAllowedTypes: String[];
    dndExternalSources: any;
    dndHorizontalList: any;
    dndEffectAllowed: string;
    pureComponent: boolean;
    dndList: any;
    dndListChange: EventEmitter<any>;
    dndDragover: EventEmitter<DndListEvent>;
    dndDrop: EventEmitter<DndListEvent>;
    dndInserted: EventEmitter<DndListEvent>;
    private _nativeElement;
    private _placeholderNode;
    private _listSettings;
    private _listNode;
    private _dragOverStopped;
    private _counter;
    constructor(_el: ElementRef, _renderer: Renderer2, _dndService: DndDraggableService);
    ngOnInit(): void;
    onDragEnter(event: any): boolean;
    onDragOver(event: any): boolean;
    onDrop(event: any): boolean;
    /**
   * We have to remove the placeholder when the element is no longer dragged over our list. The
   * problem is that the dragleave event is not only fired when the element leaves our list,
   * but also when it leaves a child element. Therefore, we determine whether the mouse cursor
   * is still pointing to an element inside the list or not.
   */
    onDragLeave(event: any): void;
    onmouseout(event: any): void;
    private _stopDrag();
    private _stopDragover();
    /**
   * Create a DndListEvent instance for events response.
   */
    private _getEventResponse(event, dropEffect, itemType, index?, item?);
    private _getPlaceholderIndex();
    private _getPlaceholderElement();
    private _getMimeType(types);
    /**
   * Determines the type of the item from the dndService, or from the mime type for items from
   * external sources. Returns undefined if no item type was set and null if the item type could
   * not be determined.
   */
    private _getItemType(mimeType);
    private _isDropAllowed(itemType);
    /**
   * Determines which drop effect to use for the given event. In Internet Explorer we have to
   * ignore the effectAllowed field on dataTransfer, since we set a fake value in dragstart.
   * In those cases we rely on dndState to filter effects. Read the design doc for more details:
   * https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
   */
    private _getDropEffect(event, ignoreDataTransfer);
    /**
   * Filters an array of drop effects using a HTML5 effectAllowed string.
   */
    private _filterEffects(effects, effectAllowed);
}
