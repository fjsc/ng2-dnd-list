export interface DndListEvent {
    callback: Function;
    event: DragEvent;
    dropEffect: string;
    external: boolean;
    type: string;
    index?: number;
    item?: any;
    stopDragover: Function;
}
export interface DndDragendEvent {
    event: Event;
    dropEffect: string;
}
