import { Subject } from 'rxjs/Subject';
export declare class DndDraggableService {
    private _isDragging;
    private _itemType;
    private _dropCallback;
    private _dropEffect;
    private _effectAllowed;
    private _removeOnDrop;
    dropEndSource: Subject<any>;
    constructor();
    setDraggingState(state: boolean): void;
    getDraggingState(): boolean;
    setItemType(value: string): void;
    getItemType(): string;
    setDropCallback(value: Function): void;
    getDropCallback(): Function;
    setDropEffect(dropEffect: string): void;
    getDropEffect(): string;
    setEffectAllowed(effectAllowed: string): void;
    getEffectAllowed(): string;
    setRemoveOnDrop(value: boolean): void;
    getRemoveOnDrop(): boolean;
}
