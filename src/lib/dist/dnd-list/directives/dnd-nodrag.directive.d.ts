export declare class DndNodragDirective {
    readonly draggable: boolean;
    onDragStart(event: any): void;
    /**
     * Stop propagation of dragend events, otherwise dnd-moved might be triggered and the element
     * would be removed.
     */
    onDragEnd(event: any): void;
}
