import { Injectable, Directive, HostBinding, Input, HostListener, ElementRef, Renderer2, Output, EventEmitter, NgModule } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DndDraggableService {
    constructor() {
        this._isDragging = false;
        this._itemType = '';
        this._removeOnDrop = false;
        this.dropEndSource = new Subject();
    }
    /**
     * @param {?} state
     * @return {?}
     */
    setDraggingState(state) {
        this._isDragging = state;
    }
    /**
     * @return {?}
     */
    getDraggingState() {
        return this._isDragging;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setItemType(value) {
        this._itemType = value.toLowerCase();
    }
    /**
     * @return {?}
     */
    getItemType() {
        return this._itemType;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setDropCallback(value) {
        this._dropCallback = value;
    }
    /**
     * @return {?}
     */
    getDropCallback() {
        return this._dropCallback;
    }
    /**
     * @param {?} dropEffect
     * @return {?}
     */
    setDropEffect(dropEffect) {
        this._dropEffect = dropEffect;
    }
    /**
     * @return {?}
     */
    getDropEffect() {
        return this._dropEffect;
    }
    /**
     * @param {?} effectAllowed
     * @return {?}
     */
    setEffectAllowed(effectAllowed) {
        this._effectAllowed = effectAllowed;
    }
    /**
     * @return {?}
     */
    getEffectAllowed() {
        return this._effectAllowed;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setRemoveOnDrop(value) {
        this._removeOnDrop = value;
    }
    /**
     * @return {?}
     */
    getRemoveOnDrop() {
        return this._removeOnDrop;
    }
}
DndDraggableService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
DndDraggableService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const MIME_TYPE = 'application/x-dnd';
const EDGE_MIME_TYPE = 'application/json';
const MSIE_MIME_TYPE = 'Text';
const ALL_EFFECTS = ['move', 'copy', 'link'];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DndDraggableDirective {
    /**
     * @param {?} _dndService
     * @param {?} _renderer
     * @param {?} _hostElement
     */
    constructor(_dndService, _renderer, _hostElement) {
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
    /**
     * @return {?}
     */
    get draggable() {
        return !this.dndDisable;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragStart(event) {
        event = event.originalEvent || event;
        if (!this.draggable) {
            return true;
        }
        this._dndService.setDraggingState(true);
        this._dndService.setItemType(this.dndType);
        const /** @type {?} */ mimeType = MIME_TYPE + (this._dndService.getItemType() ? ('-' + this._dndService.getItemType()) : '');
        // Set the allowed drop effects. See below for special IE handling.
        this._dndService.setDropEffect('none');
        this._dndService.setEffectAllowed(this.dndEffectAllowed || ALL_EFFECTS[0]);
        event.dataTransfer.effectAllowed = this._dndService.getEffectAllowed(); // TODO: set allowed effects
        try {
            event.dataTransfer.setData(mimeType, JSON.stringify(this.dndDraggable));
        }
        catch (/** @type {?} */ e) {
            const /** @type {?} */ data = {
                item: this.dndDraggable,
                type: this._dndService.getItemType()
            };
            try {
                // Setting a custom MIME type did not work, we are probably in IE or Edge.
                event.dataTransfer.setData(EDGE_MIME_TYPE, JSON.stringify(data));
            }
            catch (/** @type {?} */ e) {
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
            const /** @type {?} */ callback = this.dndCallback;
            this._dndService.setDropCallback(function (params) {
                return callback(params);
            });
        }
        event.stopPropagation();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragEnd(event) {
        const /** @type {?} */ dropEffect = this._dndService.getDropEffect();
        const /** @type {?} */ cb = { copy: 'dndCopied', link: 'dndLinked', move: 'dndMoved', none: 'dndCanceled' };
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
    /**
     * @param {?} event
     * @return {?}
     */
    click(event) {
        this.dndSelected.emit(event);
        // Prevent triggering dndSelected in parent elements.
        event.stopPropagation();
    }
}
DndDraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[dndDraggable]',
            },] },
];
/** @nocollapse */
DndDraggableDirective.ctorParameters = () => [
    { type: DndDraggableService, },
    { type: Renderer2, },
    { type: ElementRef, },
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DndListDirective {
    /**
     * @param {?} _el
     * @param {?} _renderer
     * @param {?} _dndService
     */
    constructor(_el, _renderer, _dndService) {
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
    /**
     * @return {?}
     */
    ngOnInit() {
        const /** @type {?} */ placeholder = this._getPlaceholderElement();
        placeholder.remove();
        this._placeholderNode = placeholder;
        this._listNode = this._nativeElement;
    }
    /**
     * @param {?} event
     * @return {?}
     */
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
        const /** @type {?} */ mimeType = this._getMimeType(event.dataTransfer.types);
        if (!mimeType || !this._isDropAllowed(this._getItemType(mimeType))) {
            return true;
        }
        event.preventDefault();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragOver(event) {
        event = event.originalEvent || event;
        // Check whether the drop is allowed and determine mime type.
        const /** @type {?} */ mimeType = this._getMimeType(event.dataTransfer.types);
        const /** @type {?} */ itemType = this._getItemType(mimeType);
        if (!mimeType || !this._isDropAllowed(itemType)) {
            return true;
        }
        // Make sure the placeholder is shown, which is especially important if the list is empty.
        if (this._placeholderNode.parentNode !== this._listNode) {
            this._renderer.appendChild(this._nativeElement, this._placeholderNode);
        }
        if (event.target !== this._listNode) {
            // Try to find the node direct directly below the list node.
            let /** @type {?} */ listItemNode = event.target;
            while (listItemNode.parentNode !== this._listNode && listItemNode.parentNode) {
                listItemNode = listItemNode.parentNode;
            }
            if (listItemNode.parentNode === this._listNode && listItemNode !== this._placeholderNode) {
                // If the mouse pointer is in the upper half of the list item element,
                // we position the placeholder before the list item, otherwise after it.
                const /** @type {?} */ rect = listItemNode.getBoundingClientRect();
                let /** @type {?} */ isFirstHalf;
                if (this._listSettings.horizontal) {
                    isFirstHalf = event.clientX < rect.left + rect.width / 2;
                }
                else {
                    isFirstHalf = event.clientY < rect.top + rect.height / 2;
                }
                this._listNode.insertBefore(this._placeholderNode, isFirstHalf ? listItemNode : listItemNode.nextSibling);
            }
        }
        // In IE we set a fake effectAllowed in dragstart to get the correct cursor, we therefore
        // ignore the effectAllowed passed in dataTransfer. We must also not access dataTransfer for
        // drops from external sources, as that throws an exception.
        const /** @type {?} */ ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
        const /** @type {?} */ dropEffect = this._getDropEffect(event, ignoreDataTransfer);
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
    /**
     * @param {?} event
     * @return {?}
     */
    onDrop(event) {
        this._counter = 0;
        event = event.originalEvent || event;
        // Check whether the drop is allowed and determine mime type.
        const /** @type {?} */ mimeType = this._getMimeType(event.dataTransfer.types);
        let /** @type {?} */ itemType = this._getItemType(mimeType);
        if (!mimeType || !this._isDropAllowed(itemType)) {
            return true;
        }
        // The default behavior in Firefox is to interpret the dropped element as URL and
        // forward to it. We want to prevent that even if our drop is aborted.
        event.preventDefault();
        // Unserialize the data that was serialized in dragstart.
        let /** @type {?} */ data;
        try {
            data = JSON.parse(event.dataTransfer.getData(mimeType));
        }
        catch (/** @type {?} */ e) {
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
        const /** @type {?} */ ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
        const /** @type {?} */ dropEffect = this._getDropEffect(event, ignoreDataTransfer);
        if (dropEffect === 'none') {
            return this._stopDragover();
        }
        // Invoke the callback, which can transform the transferredObject and even abort the drop.
        const /** @type {?} */ index = this._getPlaceholderIndex();
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
            const /** @type {?} */ newList = [...this.dndList.slice(0, index), data, ...this.dndList.slice(index)];
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
     * @param {?} event
     * @return {?}
     */
    onDragLeave(event) {
        this._counter--;
        event = event.originalEvent || event;
        if (this._counter !== 0) {
            // Signalize to potential parent lists that a placeholder is already shown.
            event._dndPhShown = true;
        }
        else {
            this._stopDragover();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onmouseout(event) {
        if (this._dndService.getDraggingState()) {
            this._stopDragover();
        }
    }
    /**
     * @return {?}
     */
    _stopDrag() {
        this._dragOverStopped = true;
    }
    /**
     * @return {?}
     */
    _stopDragover() {
        this._placeholderNode.remove();
        this._renderer.removeClass(this._nativeElement, 'dndDragover');
        return true;
    }
    /**
     * Create a DndListEvent instance for events response.
     * @param {?} event
     * @param {?} dropEffect
     * @param {?} itemType
     * @param {?=} index
     * @param {?=} item
     * @return {?}
     */
    _getEventResponse(event, dropEffect, itemType, index, item) {
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
    /**
     * @return {?}
     */
    _getPlaceholderIndex() {
        return Array.prototype.indexOf.call(this._nativeElement.children, this._placeholderNode);
    }
    /**
     * @return {?}
     */
    _getPlaceholderElement() {
        let /** @type {?} */ placeholder = [].slice.call(this._nativeElement.children).filter((childNode) => {
            return childNode.className.indexOf('dndPlaceholder') > -1;
        });
        if (placeholder.length) {
            return placeholder;
        }
        placeholder = this._renderer.createElement('li');
        this._renderer.addClass(placeholder, 'dndPlaceholder');
        return placeholder;
    }
    /**
     * @param {?} types
     * @return {?}
     */
    _getMimeType(types) {
        if (!types) {
            return MSIE_MIME_TYPE; // IE 9 workaround.
        }
        for (let /** @type {?} */ i = 0; i < types.length; i++) {
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
     * @param {?} mimeType
     * @return {?}
     */
    _getItemType(mimeType) {
        if (this._dndService.getDraggingState()) {
            return this._dndService.getItemType() || undefined;
        }
        if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE) {
            return null;
        }
        return (mimeType && mimeType.substr(MIME_TYPE.length + 1)) || undefined;
    }
    /**
     * @param {?} itemType
     * @return {?}
     */
    _isDropAllowed(itemType) {
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
     * @param {?} event
     * @param {?} ignoreDataTransfer
     * @return {?}
     */
    _getDropEffect(event, ignoreDataTransfer) {
        let /** @type {?} */ effects = ALL_EFFECTS;
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
    }
    /**
     * Filters an array of drop effects using a HTML5 effectAllowed string.
     * @param {?} effects
     * @param {?} effectAllowed
     * @return {?}
     */
    _filterEffects(effects, effectAllowed) {
        if (effectAllowed === 'all') {
            return effects;
        }
        return effects.filter(function (effect) {
            return effectAllowed.toLowerCase().indexOf(effect) !== -1;
        });
    }
}
DndListDirective.decorators = [
    { type: Directive, args: [{
                selector: '[dndList]',
            },] },
];
/** @nocollapse */
DndListDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: DndDraggableService, },
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DndNodragDirective {
    /**
     * @return {?}
     */
    get draggable() {
        return true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragStart(event) {
        event = event.originalEvent || event;
        if (!event._dndHandle) {
            // If a child element already reacted to dragstart and set a dataTransfer object, we will
            // allow that. For example, this is the case for user selections inside of input elements.
            if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
                event.preventDefault();
            }
            event.stopPropagation();
        }
    }
    /**
     * Stop propagation of dragend events, otherwise dnd-moved might be triggered and the element
     * would be removed.
     * @param {?} event
     * @return {?}
     */
    onDragEnd(event) {
        event = event.originalEvent || event;
        if (!event._dndHandle) {
            event.stopPropagation();
        }
    }
}
DndNodragDirective.decorators = [
    { type: Directive, args: [{
                selector: '[dndNodrag]',
            },] },
];
/** @nocollapse */
DndNodragDirective.propDecorators = {
    "draggable": [{ type: HostBinding, args: ['draggable',] },],
    "onDragStart": [{ type: HostListener, args: ['dragstart', ['$event'],] },],
    "onDragEnd": [{ type: HostListener, args: ['dragend', ['$event'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DndHandleDirective {
    /**
     * @return {?}
     */
    get draggable() {
        return true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragStart(event) {
        event = event.originalEvent || event;
        event._dndHandle = true;
    }
}
DndHandleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[dndHandle]',
            },] },
];
/** @nocollapse */
DndHandleDirective.propDecorators = {
    "draggable": [{ type: HostBinding, args: ['draggable',] },],
    "onDragStart": [{ type: HostListener, args: ['dragstart dragend', ['$event'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const declarations = [
    DndDraggableDirective,
    DndListDirective,
    DndNodragDirective,
    DndHandleDirective
];
class DndListModule {
}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { DndListModule, DndDraggableDirective, DndHandleDirective, DndListDirective, DndNodragDirective, DndDraggableDirective as ɵa, DndHandleDirective as ɵe, DndListDirective as ɵc, DndNodragDirective as ɵd, DndDraggableService as ɵb };
//# sourceMappingURL=fjsc-ng-dnd-list.js.map
