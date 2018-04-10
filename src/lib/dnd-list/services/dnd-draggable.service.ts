import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DndDraggableService {

  private _isDragging = false;
  private _itemType = '';
  private _dropCallback: Function;
  private _dropEffect: string;
  private _effectAllowed: string;
  private _removeOnDrop = false;

  public dropEndSource = new Subject<any>();

  constructor() {}

  setDraggingState(state: boolean) {
    this._isDragging = state;
  }

  getDraggingState(): boolean {
    return this._isDragging;
  }

  setItemType(value: string): void {
    this._itemType = value.toLowerCase();
  }

  getItemType(): string {
    return this._itemType;
  }

  setDropCallback(value: Function): void {
    this._dropCallback = value;
  }

  getDropCallback(): Function {
    return this._dropCallback;
  }

  setDropEffect(dropEffect: string): void {
    this._dropEffect = dropEffect;
  }

  getDropEffect(): string {
    return this._dropEffect;
  }

  setEffectAllowed(effectAllowed: string): void {
    this._effectAllowed = effectAllowed;
  }

  getEffectAllowed(): string {
    return this._effectAllowed;
  }

  setRemoveOnDrop(value: boolean) {
    this._removeOnDrop = value;
  }

  getRemoveOnDrop() {
    return this._removeOnDrop;
  }

}
