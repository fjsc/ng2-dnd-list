import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DndListEvent } from '@fjsc/ng-dnd-list';

@Component({
  selector: 'dnd-multi-demo',
  templateUrl: './multi-demo.component.html',
  styleUrls: ['./multi-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiDemoComponent implements OnInit {

  public models = [
    { listName: 'A', items: [], dragging: false },
    { listName: 'B', items: [], dragging: false }
  ];
  public img: HTMLImageElement;
  ngOnInit(): void {
    this.img = new Image();
    this.img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAn0lEQVRIS72UQRLAIAgD9aG+zoe2w4EOtWJCR/QsWSSRWpJPTdYvIUBr7ZKGeu90HX1RxfXFLIQCjOIRCAR44iwEAmwIUj0Q0DaACM1MXAG8ms+IkIgXU6/uBbCG/nnBzPgHgNIS/fHa4DmATUl0zqvasybrnFNjujJz20fzICkAFF+0tqlll7qurfF2dKhzvUu9YISw4lIXAkTXxRHADcdvgBmCVnF5AAAAAElFTkSuQmCC';
    // Generate the initial model
    this.models.forEach(function (list) {
      for (let i = 1; i <= 4; ++i) {
        list.items.push({ label: 'Item ' + list.listName + i });
      }
    });
  }

  /**
   * dnd-dragging determines what data gets serialized and send to the receiver
   * of the drop. While we usually just send a single object, we send the array
   * of all selected items here.
   */
  public getSelectedItemsIncluding(list: any, item: any) {
    return list.items.filter((itm: any) => itm.selected || itm === item);
  }

  /**
     * We set the list into dragging state, meaning the items that are being
     * dragged are hidden. We also use the HTML5 API directly to set a custom
     * image, since otherwise only the one item that the user actually dragged
     * would be shown as drag image.
     */
  public onDragstart(event: DragEvent, list: any, item: any) {
    item.selected = true;
    setTimeout(() => list.dragging = true);
    if (event.dataTransfer.setDragImage) {
      event.dataTransfer.setDragImage(this.img, -10, 30);
    }
  }

  /**
   * In the dnd-drop callback, we now have to handle the data array that we
   * sent above. We handle the insertion into the list ourselves. By returning
   * true, the dnd-list directive won't do the insertion itself.
   */
  public onDrop(event: DndListEvent, list) {
    event.item.forEach(function (item) { item.selected = false; });
    list.items = list.items.slice(0, event.index)
      .concat(event.item)
      .concat(list.items.slice(event.index));
    return true;
  }

  /**
   * Last but not least, we have to remove the previously dragged items in the
   * dnd-moved callback.
   */
  onMoved(index, list) {
    list.items = list.items.filter(function (item) { return !item.selected; });
  }

  onSelectItem(item) {
    item.selected = !item.selected;
  }



}
