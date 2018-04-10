ng-dnd-list
===========================
This library is a remake of [angular-drag-and-drop-lists](https://github.com/marceljuenemann/angular-drag-and-drop-lists) in Angular v2 and upper.
Angular directives that allow you to build sortable lists with the native HTML5 drag & drop API. The directives can also be nested to bring drag & drop to your WYSIWYG editor, your tree, or whatever fancy structure you are building.

## Demo
* [Simple Lists](https://fjsc.github.io/ng-dnd-list/index.html#/simple-demo)
* [Advanced Features](https://fjsc.github.io/ng-dnd-list/index.html#/advanced-demo)
* [Multiselection Demo](https://fjsc.github.io/ng-dnd-list/index.html#/multiselection-demo)


## Supported browsers

**Touch devices are not supported**, because they do not implement the HTML5 drag & drop standard. However, you can use a [shim](https://github.com/timruffles/ios-html5-drag-drop-shim) to make it work on touch devices as well.

Internet Explorer 8 or lower is *not supported*, but all modern browsers are (see changelog for list of tested browsers).


## Download & Installation
### Installing

You can install ng-dnd-list package from npm:

```
npm i @fjsc/ng-dnd-list
```

### Work with the code

You can use Npm or Yarn to work with ng-dnd-list. If you want to use Yarn, it has to be installed first as a global dependency in your local machine.

```
sudo npm i -g yarn
```

Once Yarn is installed or Npm is ready, you can install ng-dnd-list using:

```
yarn
```

or

```
npm install
```


## dndDraggable directive
Use the dndDraggable directive to make your element draggable

**Inputs**
* `[dndDraggable]` (Object) Required attribute. The value has to be an object that represents the data of the element. In case of a drag and drop operation the object will be serialized and unserialized on the receiving end.
* `[dndEffectAllowed]` (String) Use this attribute to limit the operations that can be performed. Valid options are `move`, `copy` and `link`, as well as `all`, `copyMove`, `copyLink` and `linkMove`, while `move` is the default value. The semantics of these operations are up to you and have to be implemented using the output events described below. If you allow multiple options, the user can choose between them by using the modifier keys (OS specific). The cursor will be changed accordingly, expect for IE and Edge, where this is not supported. Note that the implementation of this attribute is very buggy in IE9. This attribute works together with `dndExternalSources` except on Safari and IE, where the restriction will be lost when dragging accross browser tabs. [Demo](https://fjsc.github.io/ng-dnd-list/index.html#/advanced-demo)
* `[dndType]` (string) Use this attribute if you have different kinds of items in your application and you want to limit which items can be dropped into which lists. Combine with dnd-allowed-types on the dnd-list(s). This attribute must be a lower case string. Upper case characters can be used, but will be converted to lower case automatically.
* `[dndDisable]` (boolean) You can use this attribute to dynamically disable the draggability of the element. This is useful if you have certain list items that you don't want to be draggable, or if you want to disable drag & drop completely without having two different code branches (e.g. only allow for admins).

**Outputs**
* `(dndDragstart)`: (DragEvent) Event that is emitted when the element was dragged. The original dragstart event will be provided in the local `$event` variable. [Demo](https://fjsc.github.io/ng-dnd-list/index.html#/advanced-demo)
* `(dndMoved)` (DragEvent) Event that is emitted when the element was moved. Usually you will remove your element from the original list in this callback, since the directive is not doing that for you automatically. The original dragend event will be provided in the local `event` variable. [Demo](https://fjsc.github.io/ng-dnd-list/index.html#/advanced-demo)
* `(dndCopied)` (DragEvent) Same as dnd-moved, just that it is emitted when the element was copied instead of moved. The original dragend event will be provided in the local `event` variable. [Demo](https://fjsc.github.io/ng-dnd-list/index.html#/advanced-demo)
* `(dndLinked)` (DragEvent) Same as dnd-moved, just that it is emitted when the element was linked instead of moved. The original dragend event will be provided in the local `event` variable. [Demo](https://fjsc.github.io/ng-dnd-list/index.html#/advanced-demo)
* `(dndCanceled)` (DragEvent) Event that is emitted when the element was dragged, but the operation was canceled and the element was not dropped. The original dragend event will be provided in the local event variable. [Demo](https://fjsc.github.io/ng-dnd-list/index.html#/advanced-demo)
* `(dndDragend)` (DndDragendEvent) Event that is emitted when the drag operation ended. Available local variables are `event` and `dropEffect`. [Demo](https://fjsc.github.io/ng-dnd-list/index.html#/advanced-demo)
* `(dndSelected)` (DragEvent) Event that is emitted when the element was clicked but not dragged. The original click event will be provided in the local `event` variable.

**Models**
* `DndDragendEvent` 
   * `event`: The original dragend event sent by the browser.
   * `dropEffect`: string. Target dropEffect value.

**CSS classes**
* `dndDragging` This class will be added to the element while the element is being dragged. It will affect both the element you see while dragging and the source element that stays at it's position. Do not try to hide the source element with this class, because that will abort the drag operation.
* `dndDraggingSource` This class will be added to the element after the drag operation was started, meaning it only affects the original element that is still at it's source position, and not the "element" that the user is dragging with his mouse pointer

## dndList directive

Use the dndList directive to make your list element a dropzone. Usually you will add a single li element as child with the *ngFor directive. If you don't do that, we will not be able to position the dropped element correctly. If you want your list to be sortable, also add the dndDraggable directive to your li element(s).

**Inputs**
* `[dndList]` Required attribute. The value has to be the array in which the data of the dropped element should be inserted. The value can be blank if used with a custom dndDrop handler that handles the insertion on its own.
* `[dndAllowedTypes]` Optional array of allowed item types. When used, only items that had a matching dnd-type attribute will be dropable. Upper case characters will automatically be converted to lower case.
* `[dndEffectAllowed]` Optional string expression that limits the drop effects that can be performed on the list. See dnd-effect-allowed on dnd-draggable for more details on allowed options. The default value is `all`.
* `[dndDisable]` Optional boolean expression. When it evaluates to true, no dropping into the list is possible. Note that this also disables rearranging items inside the list.
* `[dndHorizontalList]` Optional boolean expression. When it evaluates to true, the positioning algorithm will use the left and right halfs of the list items instead of the upper and lower halfs. [Demo](https://fjsc.github.io/ng-dnd-list/index.html#/advanced-demo)
* `[dndExternalSources]` Optional boolean expression. When it evaluates to true, the list accepts drops from sources outside of the current browser tab, which allows to drag and drop accross different browser tabs. The only major browser for which this is currently not working is Microsoft Edge. [Demo](https://fjsc.github.io/ng-dnd-list/index.html#/advanced-demo)

**Outputs**
* `(dndListChange)` (Object) Event emitted after an element is dropped. The value will be the new list value after drop.
* `(dndDragover)` (DndListEvent) Event emitted when an element is dragged over the list. If the expression is set, but does not return true, the element is not allowed to be dropped. 
* `(dndDrop)` (DndListEvent) Event emitted when an element is dropped on the list.
* `(dndInserted)` (DndListEvent) Event emitted after a drop if the element was actually inserted into the list. The same local variables as for `dndDrop` will be available. Note that for reorderings inside the same list the old element will still be in the list due to the fact that `dndMoved` was not called yet. [Demo](https://fjsc.github.io/ng-dnd-list/index.html#/advanced-demo)

**Models**
* `DndListEvent` The following variables will be available:
   * `event` (DragEvent): The original dragover event sent by the browser.
   * `dropEffect` (string):  The dropEffect that is going to be performed, see dndEffectAllowed.
   * `external` (boolean): Whether the element was dragged from an external source. See `dndExternalSources`.
   * `type` (string): The `dndType` set on the dndDraggable, or undefined if unset. Will be null for drops from external sources in IE and Edge, since we don't know the type in those cases.
   * `index` (number):  The position in the list at which the element would be dropped.
   * `item`(any): Only available onDrop event. This will be the transferred object. 
   * `stopDragover`: (Function) Calling the function causes the drop will be canceled and the element won't be inserted.

**CSS classes**
* `dndPlaceholder` When an element is dragged over the list, a new placeholder child element will be added. This element is of type `li` and has the class `dndPlaceholder` set. Alternatively, you can define your own placeholder by creating a child element with `dndPlaceholder` class.
* `dndDragover` This class will be added to the list while an element is being dragged over the list.

## dndNodrag directive

Use the `dndNodrag` directive inside of `dndDraggable` elements to prevent them from starting drag operations. This is especially useful if you want to use input elements inside of `dndDraggable` elements or create specific handle elements.

**Note:** This directive does not work in Internet Explorer 9.

## dndHandle directive

Use the `dndHandle` directive within a `dndNodrag` element in order to allow dragging of that element after all. Therefore, by combining `dndNodrag` and `dndHandle` you can allow `dndDraggable` elements to only be dragged via specific *handle* elements.

**Note:** Internet Explorer will show the handle element as drag image instead of the `dndDraggable` element. You can work around this by styling the handle element differently when it is being dragged. Use the CSS selector `.dndDragging:not(.dndDraggingSource) [dndHandle]` for that.

## Recommended CSS styles
It is recommended that you apply the following CSS styles:

* If your application is about moving elements by drag and drop, it is recommended that you hide the source element while dragging, i.e. setting `display: none` on the `.dndDraggingSource` class.
* If your application allows to drop elements into empty lists, you need to ensure that empty lists never have a height or width of zero, e.g. by setting a `min-width`.
* You should style the `.dndPlaceholder` class accordingly.

## License

Copyright (c) 2018 [Fran Sevilla](mailto:fjsc.noah@gmail.com)

[MIT License](https://raw.githubusercontent.com/fjsc/ng-dnd-list/master/LICENSE)
