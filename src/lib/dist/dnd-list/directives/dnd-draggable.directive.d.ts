import { ElementRef, Renderer2, EventEmitter } from '@angular/core';
import { DndDraggableService } from '../services/dnd-draggable.service';
import { DndDragendEvent } from '../models/events';
export declare class DndDraggableDirective {
    private _dndService;
    private _renderer;
    dndDraggable: any;
    dndDisable: boolean;
    dndType: string;
    dndCallback: Function;
    dndEffectAllowed: string;
    dndDragstart: EventEmitter<DragEvent>;
    dndDragend: EventEmitter<DndDragendEvent>;
    dndSelected: EventEmitter<Event>;
    dndMoved: EventEmitter<DragEvent>;
    dndCopied: EventEmitter<DragEvent>;
    dndLinked: EventEmitter<DragEvent>;
    dndCanceled: EventEmitter<DragEvent>;
    readonly draggable: boolean;
    private _nativeElement;
    constructor(_dndService: DndDraggableService, _renderer: Renderer2, _hostElement: ElementRef);
    onDragStart(event: any): boolean;
    onDragEnd(event: DragEvent): void;
    click(event: MouseEvent): void;
}
