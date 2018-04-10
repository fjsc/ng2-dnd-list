import { Component, OnInit } from '@angular/core';
import { DndListEvent } from '@fjsc/ng2-dnd-list';

@Component({
  selector: 'dnd-advanced-demo',
  templateUrl: './advanced-demo.component.html',
  styleUrls: ['./advanced-demo.component.css']
})
export class AdvancedDemoComponent implements OnInit {

  public model = [[], []];

  ngOnInit(): void {
    const effects = ['all', 'move', 'copy', 'link', 'copyLink', 'copyMove'];
    let id = 10;
    effects.forEach((effect: string, index: number) => {
      const container = { items: [], effectAllowed: effect };
      for (let k = 0; k < 7; ++k) {
        container.items.push({ label: effect + ' ' + id++, effectAllowed: effect });
      }
      this.model[index % this.model.length].push(container);
    });
  }

  public onDragover(event: DndListEvent, items?: Array<any>) {
    // event.stopDragover();
    this.logListEvent('dragged over', event.index, event.external, event.type);

    if (event.type === 'container' && !event.external) {
      console.log('Container being dragged contains ' + event.callback() + ' items');
    }
    if ( items && items.length > 9) {
      event.stopDragover();
    }
  }

  public onDrop(event: DndListEvent) {
    this.logListEvent('dropped at', event.index, event.external, event.type);
    return event.item;
  }

  public logEvent(message) {
    console.log(message);
  }

  public onInserted(event: DndListEvent) {
    this.logListEvent('inserted at', event.index, event.external, event.type);
  }

  public logListEvent(action: string, index: number, external: boolean, type: string) {
    let message = external ? 'External ' : '';

    message += type + ' element was ' + action + ' position ' + index;
    console.log(message);
  }

  change($event, containers) {
    containers = $event;
  }

  moved(index: number, list: Array<any>) {
    list.splice(index, 1);
  }

}
