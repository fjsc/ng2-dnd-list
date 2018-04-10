import { __spread } from 'tslib';
import { Injectable, Directive, HostBinding, Input, HostListener, ElementRef, Renderer2, Output, EventEmitter, NgModule } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CommonModule } from '@angular/common';

var DndDraggableService = /** @class */ (function () {
    function DndDraggableService() {
        this._isDragging = false;
        this._itemType = '';
        this._removeOnDrop = false;
        this.dropEndSource = new Subject();
    }
    DndDraggableService.prototype.setDraggingState = function (state) {
        this._isDragging = state;
    };
    DndDraggableService.prototype.getDraggingState = function () {
        return this._isDragging;
    };
    DndDraggableService.prototype.setItemType = function (value) {
        this._itemType = value.toLowerCase();
    };
    DndDraggableService.prototype.getItemType = function () {
        return this._itemType;
    };
    DndDraggableService.prototype.setDropCallback = function (value) {
        this._dropCallback = value;
    };
    DndDraggableService.prototype.getDropCallback = function () {
        return this._dropCallback;
    };
    DndDraggableService.prototype.setDropEffect = function (dropEffect) {
        this._dropEffect = dropEffect;
    };
    DndDraggableService.prototype.getDropEffect = function () {
        return this._dropEffect;
    };
    DndDraggableService.prototype.setEffectAllowed = function (effectAllowed) {
        this._effectAllowed = effectAllowed;
    };
    DndDraggableService.prototype.getEffectAllowed = function () {
        return this._effectAllowed;
    };
    DndDraggableService.prototype.setRemoveOnDrop = function (value) {
        this._removeOnDrop = value;
    };
    DndDraggableService.prototype.getRemoveOnDrop = function () {
        return this._removeOnDrop;
    };
    return DndDraggableService;
}());
DndDraggableService.decorators = [
    { type: Injectable },
];
DndDraggableService.ctorParameters = function () { return []; };
var MIME_TYPE = 'application/x-dnd';
var EDGE_MIME_TYPE = 'application/json';
var MSIE_MIME_TYPE = 'Text';
var ALL_EFFECTS = ['move', 'copy', 'link'];
var DndDraggableDirective = /** @class */ (function () {
    function DndDraggableDirective(_dndService, _renderer, _hostElement) {
        this._dndService = _dndService;
        this._renderer = _renderer;
        this.dndType = '';
        this.dndDragstart = new EventEmitter();
        this.dndDragend = new EventEmitter();
        this.dndSelected = new EventEmitter();
        this.dndMoved = new EventEmitter();
        this.dndCopied = new EventEmitter();
        this.dndLinked = new EventEmitter();
        this.dndCanceled = new EventEmitter();
        this._nativeElement = _hostElement.nativeElement;
    }
    Object.defineProperty(DndDraggableDirective.prototype, "draggable", {
        get: function () {
            return !this.dndDisable;
        },
        enumerable: true,
        configurable: true
    });
    DndDraggableDirective.prototype.onDragStart = function (event) {
        var _this = this;
        event = event.originalEvent || event;
        if (!this.draggable) {
            return true;
        }
        this._dndService.setDraggingState(true);
        this._dndService.setItemType(this.dndType);
        var mimeType = MIME_TYPE + (this._dndService.getItemType() ? ('-' + this._dndService.getItemType()) : '');
        this._dndService.setDropEffect('none');
        this._dndService.setEffectAllowed(this.dndEffectAllowed || ALL_EFFECTS[0]);
        event.dataTransfer.effectAllowed = this._dndService.getEffectAllowed();
        try {
            event.dataTransfer.setData(mimeType, JSON.stringify(this.dndDraggable));
        }
        catch (e) {
            var data = {
                item: this.dndDraggable,
                type: this._dndService.getItemType()
            };
            try {
                event.dataTransfer.setData(EDGE_MIME_TYPE, JSON.stringify(data));
            }
            catch (e) {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData(MSIE_MIME_TYPE, JSON.stringify(data));
            }
        }
        this._renderer.addClass(this._nativeElement, 'dndDragging');
        setTimeout(function () { return _this._renderer.addClass(_this._nativeElement, 'dndDraggingSource'); }, 0);
        if (event._dndHandle && event.dataTransfer.setDragImage) {
            event.dataTransfer.setDragImage(this._nativeElement, 0, 0);
        }
        this.dndDragstart.emit(event);
        if (this.dndCallback) {
            var callback_1 = this.dndCallback;
            this._dndService.setDropCallback(function (params) {
                return callback_1(params);
            });
        }
        event.stopPropagation();
    };
    DndDraggableDirective.prototype.onDragEnd = function (event) {
        var _this = this;
        var dropEffect = this._dndService.getDropEffect();
        var cb = { copy: 'dndCopied', link: 'dndLinked', move: 'dndMoved', none: 'dndCanceled' };
        this[cb[dropEffect]].emit(event);
        this.dndDragend.emit({
            event: event,
            dropEffect: dropEffect
        });
        this._dndService.setDraggingState(false);
        this._dndService.setDropCallback(undefined);
        this._dndService.setRemoveOnDrop(false);
        this._renderer.removeClass(this._nativeElement, 'dndDragging');
        this._renderer.removeClass(this._nativeElement, 'dndDraggingSource');
        event.stopPropagation();
        setTimeout(function () { return _this._renderer.removeClass(_this._nativeElement, 'dndDraggingSource'); }, 0);
    };
    DndDraggableDirective.prototype.click = function (event) {
        this.dndSelected.emit(event);
        event.stopPropagation();
    };
    return DndDraggableDirective;
}());
DndDraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[dndDraggable]',
            },] },
];
DndDraggableDirective.ctorParameters = function () { return [
    { type: DndDraggableService, },
    { type: Renderer2, },
    { type: ElementRef, },
]; };
DndDraggableDirective.propDecorators = {
    "dndDraggable": [{ type: Input },],
    "dndDisable": [{ type: Input },],
    "dndType": [{ type: Input },],
    "dndCallback": [{ type: Input },],
    "dndEffectAllowed": [{ type: Input },],
    "dndDragstart": [{ type: Output },],
    "dndDragend": [{ type: Output },],
    "dndSelected": [{ type: Output },],
    "dndMoved": [{ type: Output },],
    "dndCopied": [{ type: Output },],
    "dndLinked": [{ type: Output },],
    "dndCanceled": [{ type: Output },],
    "draggable": [{ type: HostBinding, args: ['draggable',] },],
    "onDragStart": [{ type: HostListener, args: ['dragstart', ['$event'],] },],
    "onDragEnd": [{ type: HostListener, args: ['dragend', ['$event'],] },],
    "click": [{ type: HostListener, args: ['click', ['$event'],] },],
};
var DndListDirective = /** @class */ (function () {
    function DndListDirective(_el, _renderer, _dndService) {
        this._el = _el;
        this._renderer = _renderer;
        this._dndService = _dndService;
        this.dndDisable = false;
        this.dndListChange = new EventEmitter();
        this.dndDragover = new EventEmitter();
        this.dndDrop = new EventEmitter();
        this.dndInserted = new EventEmitter();
        this._listSettings = {};
        this._dragOverStopped = false;
        this._counter = 0;
        this._nativeElement = this._el.nativeElement;
    }
    DndListDirective.prototype.ngOnInit = function () {
        var placeholder = this._getPlaceholderElement();
        placeholder.remove();
        this._placeholderNode = placeholder;
        this._listNode = this._nativeElement;
    };
    DndListDirective.prototype.onDragEnter = function (event) {
        this._counter++;
        this._dragOverStopped = false;
        event = event.originalEvent || event;
        this._listSettings = {
            allowedTypes: Array.isArray(this.dndAllowedTypes) && this.dndAllowedTypes.join('|').toLowerCase().split('|'),
            disabled: this.dndDisable,
            externalSources: this.dndExternalSources,
            horizontal: this.dndHorizontalList
        };
        var mimeType = this._getMimeType(event.dataTransfer.types);
        if (!mimeType || !this._isDropAllowed(this._getItemType(mimeType))) {
            return true;
        }
        event.preventDefault();
    };
    DndListDirective.prototype.onDragOver = function (event) {
        event = event.originalEvent || event;
        var mimeType = this._getMimeType(event.dataTransfer.types);
        var itemType = this._getItemType(mimeType);
        if (!mimeType || !this._isDropAllowed(itemType)) {
            return true;
        }
        if (this._placeholderNode.parentNode !== this._listNode) {
            this._renderer.appendChild(this._nativeElement, this._placeholderNode);
        }
        if (event.target !== this._listNode) {
            var listItemNode = event.target;
            while (listItemNode.parentNode !== this._listNode && listItemNode.parentNode) {
                listItemNode = listItemNode.parentNode;
            }
            if (listItemNode.parentNode === this._listNode && listItemNode !== this._placeholderNode) {
                var rect = listItemNode.getBoundingClientRect();
                var isFirstHalf = void 0;
                if (this._listSettings.horizontal) {
                    isFirstHalf = event.clientX < rect.left + rect.width / 2;
                }
                else {
                    isFirstHalf = event.clientY < rect.top + rect.height / 2;
                }
                this._listNode.insertBefore(this._placeholderNode, isFirstHalf ? listItemNode : listItemNode.nextSibling);
            }
        }
        var ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
        var dropEffect = this._getDropEffect(event, ignoreDataTransfer);
        if (dropEffect === 'none') {
            return this._stopDragover();
        }
        this.dndDragover.emit(this._getEventResponse(event, dropEffect, itemType));
        if (this._dragOverStopped) {
            return this._stopDragover();
        }
        event.preventDefault();
        if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
        }
        this._renderer.addClass(this._nativeElement, 'dndDragover');
        event.stopPropagation();
        return false;
    };
    DndListDirective.prototype.onDrop = function (event) {
        this._counter = 0;
        event = event.originalEvent || event;
        var mimeType = this._getMimeType(event.dataTransfer.types);
        var itemType = this._getItemType(mimeType);
        if (!mimeType || !this._isDropAllowed(itemType)) {
            return true;
        }
        event.preventDefault();
        var data;
        try {
            data = JSON.parse(event.dataTransfer.getData(mimeType));
        }
        catch (e) {
            return this._stopDragover();
        }
        if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE) {
            itemType = data.type || undefined;
            data = data.item;
            if (!this._isDropAllowed(itemType)) {
                return this._stopDragover();
            }
        }
        var ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
        var dropEffect = this._getDropEffect(event, ignoreDataTransfer);
        if (dropEffect === 'none') {
            return this._stopDragover();
        }
        var index = this._getPlaceholderIndex();
        this.dndDrop.emit(this._getEventResponse(event, dropEffect, itemType, index, data));
        if (this._dragOverStopped) {
            return this._stopDragover();
        }
        this._dndService.setDropEffect(dropEffect);
        if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
        }
        if (this.dndList && this.dndList.length) {
            var newList = __spread(this.dndList.slice(0, index), [data], this.dndList.slice(index));
            this.dndListChange.emit(newList);
        }
        this._dndService.setRemoveOnDrop(true);
        this.dndInserted.emit(this._getEventResponse(event, dropEffect, itemType, index, data));
        this._stopDragover();
        event.stopPropagation();
        return false;
    };
    DndListDirective.prototype.onDragLeave = function (event) {
        this._counter--;
        event = event.originalEvent || event;
        if (this._counter !== 0) {
            event._dndPhShown = true;
        }
        else {
            this._stopDragover();
        }
    };
    DndListDirective.prototype.onmouseout = function (event) {
        if (this._dndService.getDraggingState()) {
            this._stopDragover();
        }
    };
    DndListDirective.prototype._stopDrag = function () {
        this._dragOverStopped = true;
    };
    DndListDirective.prototype._stopDragover = function () {
        this._placeholderNode.remove();
        this._renderer.removeClass(this._nativeElement, 'dndDragover');
        return true;
    };
    DndListDirective.prototype._getEventResponse = function (event, dropEffect, itemType, index, item) {
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
    };
    DndListDirective.prototype._getPlaceholderIndex = function () {
        return Array.prototype.indexOf.call(this._nativeElement.children, this._placeholderNode);
    };
    DndListDirective.prototype._getPlaceholderElement = function () {
        var placeholder = [].slice.call(this._nativeElement.children).filter(function (childNode) {
            return childNode.className.indexOf('dndPlaceholder') > -1;
        });
        if (placeholder.length) {
            return placeholder;
        }
        placeholder = this._renderer.createElement('li');
        this._renderer.addClass(placeholder, 'dndPlaceholder');
        return placeholder;
    };
    DndListDirective.prototype._getMimeType = function (types) {
        if (!types) {
            return MSIE_MIME_TYPE;
        }
        for (var i = 0; i < types.length; i++) {
            if (types[i] === MSIE_MIME_TYPE || types[i] === EDGE_MIME_TYPE ||
                types[i].substr(0, MIME_TYPE.length) === MIME_TYPE) {
                return types[i];
            }
        }
        return null;
    };
    DndListDirective.prototype._getItemType = function (mimeType) {
        if (this._dndService.getDraggingState()) {
            return this._dndService.getItemType() || undefined;
        }
        if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE) {
            return null;
        }
        return (mimeType && mimeType.substr(MIME_TYPE.length + 1)) || undefined;
    };
    DndListDirective.prototype._isDropAllowed = function (itemType) {
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
    };
    DndListDirective.prototype._getDropEffect = function (event, ignoreDataTransfer) {
        var effects = ALL_EFFECTS;
        if (!ignoreDataTransfer) {
            effects = this._filterEffects(effects, event.dataTransfer.effectAllowed);
        }
        if (this._dndService.getDraggingState()) {
            effects = this._filterEffects(effects, this._dndService.getEffectAllowed());
        }
        if (this.dndEffectAllowed) {
            effects = this._filterEffects(effects, this.dndEffectAllowed);
        }
        if (!effects.length) {
            return 'none';
        }
        else if (event.ctrlKey && effects.indexOf('copy') !== -1) {
            return 'copy';
        }
        else if (event.altKey && effects.indexOf('link') !== -1) {
            return 'link';
        }
        else {
            return effects[0];
        }
    };
    DndListDirective.prototype._filterEffects = function (effects, effectAllowed) {
        if (effectAllowed === 'all') {
            return effects;
        }
        return effects.filter(function (effect) {
            return effectAllowed.toLowerCase().indexOf(effect) !== -1;
        });
    };
    return DndListDirective;
}());
DndListDirective.decorators = [
    { type: Directive, args: [{
                selector: '[dndList]',
            },] },
];
DndListDirective.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: DndDraggableService, },
]; };
DndListDirective.propDecorators = {
    "dndDisable": [{ type: Input },],
    "dndAllowedTypes": [{ type: Input },],
    "dndExternalSources": [{ type: Input },],
    "dndHorizontalList": [{ type: Input },],
    "dndEffectAllowed": [{ type: Input },],
    "pureComponent": [{ type: Input },],
    "dndList": [{ type: Input },],
    "dndListChange": [{ type: Output },],
    "dndDragover": [{ type: Output },],
    "dndDrop": [{ type: Output },],
    "dndInserted": [{ type: Output },],
    "onDragEnter": [{ type: HostListener, args: ['dragenter', ['$event'],] },],
    "onDragOver": [{ type: HostListener, args: ['dragover', ['$event'],] },],
    "onDrop": [{ type: HostListener, args: ['drop', ['$event'],] },],
    "onDragLeave": [{ type: HostListener, args: ['dragleave', ['$event'],] },],
    "onmouseout": [{ type: HostListener, args: ['mouseleave', ['$event'],] },],
};
var DndNodragDirective = /** @class */ (function () {
    function DndNodragDirective() {
    }
    Object.defineProperty(DndNodragDirective.prototype, "draggable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    DndNodragDirective.prototype.onDragStart = function (event) {
        event = event.originalEvent || event;
        if (!event._dndHandle) {
            if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
                event.preventDefault();
            }
            event.stopPropagation();
        }
    };
    DndNodragDirective.prototype.onDragEnd = function (event) {
        event = event.originalEvent || event;
        if (!event._dndHandle) {
            event.stopPropagation();
        }
    };
    return DndNodragDirective;
}());
DndNodragDirective.decorators = [
    { type: Directive, args: [{
                selector: '[dndNodrag]',
            },] },
];
DndNodragDirective.propDecorators = {
    "draggable": [{ type: HostBinding, args: ['draggable',] },],
    "onDragStart": [{ type: HostListener, args: ['dragstart', ['$event'],] },],
    "onDragEnd": [{ type: HostListener, args: ['dragend', ['$event'],] },],
};
var DndHandleDirective = /** @class */ (function () {
    function DndHandleDirective() {
    }
    Object.defineProperty(DndHandleDirective.prototype, "draggable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    DndHandleDirective.prototype.onDragStart = function (event) {
        event = event.originalEvent || event;
        event._dndHandle = true;
    };
    return DndHandleDirective;
}());
DndHandleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[dndHandle]',
            },] },
];
DndHandleDirective.propDecorators = {
    "draggable": [{ type: HostBinding, args: ['draggable',] },],
    "onDragStart": [{ type: HostListener, args: ['dragstart dragend', ['$event'],] },],
};
var declarations = [
    DndDraggableDirective,
    DndListDirective,
    DndNodragDirective,
    DndHandleDirective
];
var DndListModule = /** @class */ (function () {
    function DndListModule() {
    }
    return DndListModule;
}());
DndListModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: declarations,
                providers: [
                    DndDraggableService
                ],
                exports: declarations
            },] },
];

export { DndListModule, DndDraggableDirective, DndHandleDirective, DndListDirective, DndNodragDirective, DndDraggableDirective as ɵa, DndHandleDirective as ɵe, DndListDirective as ɵc, DndNodragDirective as ɵd, DndDraggableService as ɵb };
//# sourceMappingURL=fjsc-ng-dnd-list.js.map
