import { DebugElement } from '@angular/core';

class DataTransferMock {
  protected _results: any;

  constructor() { this._results = {}; }
  get dropEffect() { throw new Error('Unexcepted dropEffect getter invocation'); }
  set dropEffect(value) { throw new Error('Unexcepted dropEffect setter invocation'); }
  get effectAllowed() { throw new Error('Unexcepted effectAllowed getter invocation'); }
  set effectAllowed(value) { throw new Error('Unexcepted effectAllowed setter invocation'); }
  get types(): any { throw new Error('Unexcepted types getter invocation'); }
  set types(value) { throw new Error('Unexcepted types setter invocation'); }
  getData(p1?) { throw new Error('Unexcepted getData invocation'); }
  setData(p1?, p2?) { throw new Error('Unexcepted setData invocation'); }
  setDragImage(p1?) { throw new Error('Unexcepted setDragImage invocation'); }
  getResults() { return this._results; }
}

class DragstartDataTransfer extends DataTransferMock {
  private _allowSetDragImage = false;
  private _allowedMimeTypes;
  private _presetTypes = [];
  constructor(options) {
    super();
    this._allowSetDragImage = options.allowSetDragImage || false;
    this._allowedMimeTypes = options.allowedMimeTypes || null;
    this._presetTypes = options.presetTypes || [];
    this._results.data = {};
  }

  get effectAllowed() { throw new Error('Unexcepted effectAllowed getter invocation'); }
  set effectAllowed(value) { this._results.effectAllowed = value; }
  get types() { return this._presetTypes; }
  set types(value) { throw new Error('Unexcepted types setter invocation'); }

  setData(format, data) {
    if (this._allowedMimeTypes && !this._allowedMimeTypes.includes(format)) {
      throw new Error('Invalid mime type ' + format);
    }
    this._results.data[format] = data;
  }

  setDragImage(img) {
    if (!this._allowSetDragImage) {
      throw new Error('Unexcepted setDragImage invocation');
    }
    this._results.dragImage = img;
  }
}

class DropzoneDataTransfer extends DataTransferMock {
  protected _data: any;
  constructor(data, options) {
    super();
    this._data = data;
    this.dropEffect = options.dropEffect || 'move';
    this.effectAllowed = options.effectAllowed || 'move';
    this.types = options.undefinedTypes ? undefined : Object.keys(data);
  }

  get dropEffect() { throw new Error('Unexcepted dropEffect getter invocation'); }
  set dropEffect(value) { this._results.dropEffect = value; }
  get effectAllowed() { return this.effectAllowed; }
  set effectAllowed(value) { throw new Error('Unexcepted effectAllowed setter invocation'); }
  get types() { return this.types; }
  set types(value) { throw new Error('Unexcepted types setter invocation'); }
}

class DropDataTransfer extends DropzoneDataTransfer {
  getData(format) { return this._data[format]; }
}

class DragEventMock {
  protected _type: string;
  protected _dataTransfer: any;
  protected _options: any;
  protected _results: any;
  constructor(type, dataTransfer, options) {
    this._type = type;
    this._dataTransfer = dataTransfer;
    this._options = options;
    this._results = { dataTransfer: dataTransfer.getResults() };
  }

  get clientX() { return this._options.clientX || 0; }
  get clientY() { return this._options.clientY || 0; }
  get ctrlKey() { return this._options.ctrlKey || false; }
  get altKey() { return this._options.altKey || false; }
  get dataTransfer() { return this._dataTransfer; }
  get originalEvent() { return this; }
  get target() { return this._options.target || undefined; }
  get type() { return this._type; }
  get _dndHandle() { return this._options.dndHandle || undefined; }
  get _dndPhShown() { return this._options.phShown || undefined; }
  set _dndPhShown(value) { this._results.setDndPhShown = value; }

  preventDefault() { this._results.invokedPreventDefault = true; }
  stopPropagation() { this._results.invokedStopPropagation = true; }
  getResults() { return this._results; }
}

class DragEventResult {
  protected _results: any;
  protected _type: any;
  constructor(element: DebugElement, type: string, dataTransfer, opt_eventOptions) {
    const event = new DragEventMock(type, dataTransfer, opt_eventOptions || {});
    this._results = event.getResults();
    this._results.returnValue = element.triggerEventHandler(type, event);
    this._type = type;
  }

  get propagationStopped() { return !!this._results.invokedStopPropagation; }
  get defaultPrevented() { return !!this._results.invokedPreventDefault; }
  get dndPhShownSet() { return this._results.setDndPhShown || false; }
  get returnValue() { return this._results.returnValue; }
  get dropEffect() { return this._results.dataTransfer.dropEffect; }
  get type() { return this._type; }
}

export class Dragstart extends DragEventResult {
  constructor(element: DebugElement, options: any) {
    super(element, 'dragstart', new DragstartDataTransfer(options), options);
  }

  get data() { return this._results.dataTransfer.data; }
  get dragImage() { return this._results.dataTransfer.dragImage; }
  get effectAllowed() { return this._results.dataTransfer.effectAllowed; }

  static on(element, opt_options = {}) {
    return new Dragstart(element, opt_options);
  }

  dragenter(element, opt_options) {
    const options = Object.assign({}, { effectAllowed: this.effectAllowed }, opt_options);
    return new Dragenter(element, this._results.dataTransfer.data, options);
  }

  dragover(element, opt_options) {
    return this.dragenter(element, opt_options).dragover(element);
  }

  dragend(element) {
    return Dragend.on(element);
  }
}

class Dragend extends DragEventResult {
  constructor(element, options) {
    super(element, 'dragend', new DataTransferMock(), options);
  }

  static on(element, opt_options?) {
    return new Dragend(element, opt_options || {});
  }
}

class DropzoneEventResult extends DragEventResult {
  protected _originalData: any;
  protected _options: any;
  constructor(element, type, data, dataTransfer, options) {
    options.target = options.target || element[0];
    super(element, type, dataTransfer, options);
    this._originalData = Object.assign({}, data);
    this._options = options;
  }

  dragover(element, opt_options?) {
    return new Dragover(element, this._originalData, Object.assign({}, this._options, opt_options));
  }
}

class Dragenter extends DropzoneEventResult {
  constructor(element, data, options) {
    super(element, 'dragenter', data, new DropzoneDataTransfer(data, options), options);
  }

  static externalOn(element, data, opt_options) {
    return new Dragenter(element, data, opt_options || {});
  }

  static validExternalOn(element, opt_options) {
    return Dragenter.externalOn(element, { 'application/x-dnd': '{"hello":"world"}'}, opt_options);
  }
}

class Dragover extends DropzoneEventResult {
  constructor(element, data, options) {
    super(element, 'dragover', data, new DropzoneDataTransfer(data, options), options);
  }

  dragleave(element, opt_options) {
    return new Dragleave(element, this._originalData, Object.assign({}, this._options, opt_options));
  }

  drop(element, opt_options) {
    return new Drop(element, this._originalData, Object.assign({}, this._options, opt_options));
  }
}

class Dragleave extends DropzoneEventResult {
  constructor(element, data, options) {
    super(element, 'dragleave', data, new DataTransferMock(), options);
  }
}

class Drop extends DropzoneEventResult {
  constructor(element, data, options) {
    super(element, 'drop', data, new DropDataTransfer(data, options), options);
  }

  dragend(element) {
    return Dragend.on(element);
  }
}
