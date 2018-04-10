import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DndListModule } from '../../dnd-list.module';
import { Dragstart } from '../../../../../test/mocks';

@Component({
  template: `
  <ul *ngFor="let list of model; let i = index;" [ngClass]="'list-' + i ">
    <li *ngFor="let item of model[i]; let i = index;"
      [ngClass]="{'selected': selected === item}"
      [dndDraggable]="item"
      [dndDisable]="disable"
      [dndType]="dndType"
      (dndMoved)="moved(i, list)"
      dndEffectAllowed="move"
      (dndSelected)="selected = item">
      {{item.label}}
    </li>
  </ul>
  `
})
class TestDndDraggableComponent {
  public selected = {};
  public disable = false;
  public dndType = '';
  public model = [
    this.getItemList(),  // list1
    this.getItemList()   // list2
  ];

  getItemList() {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push({
        value: i,
        label: 'item' + i
      });
    }
    return items;
  }
}

describe('[DndDraggableDirective]', () => {

  let fixture: ComponentFixture<TestDndDraggableComponent>;
  let component: TestDndDraggableComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DndListModule],
      declarations: [TestDndDraggableComponent]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDndDraggableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('On init', () => {
    it('sets the draggable attribute', () => {
      expect(fixture.debugElement.query(By.css('li')).nativeElement.getAttribute('draggable')).toBe('true');
    });

    it('watches and handles the dnd-disabled-if expression', () => {
      const draggableElement = fixture.debugElement.query(By.css('li')).nativeElement;
      expect(draggableElement.getAttribute('draggable')).toBe('true');
      component.disable = true;
      fixture.detectChanges();
      expect(draggableElement.getAttribute('draggable')).toBe('false');
      component.disable = false;
      fixture.detectChanges();
      expect(draggableElement.getAttribute('draggable')).toBe('true');
    });

  });

  describe('dragstart handler', () => {

    beforeEach(() => {
      // element = compileAndLink(SIMPLE_HTML);
    });

    it('calls setData with serialized data', () => {
      const element = fixture.debugElement.query(By.css('li')); // select the first item
      expect(Dragstart.on(element).data).toEqual({ 'application/x-dnd': '{"value":0,"label":"item0"}' });
    });

    it('converts the dnd-type to lower case', () => {
      component.dndType = 'Foo';
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('li')); // select the first item
      expect(Dragstart.on(element).data).toEqual({ 'application/x-dnd-foo': '{"value":0,"label":"item0"}' });
    });

    it('uses application/json mime type if custom types are not allowed', () => {
      const element = fixture.debugElement.query(By.css('li')); // select the first item
      const dragstart = Dragstart.on(element, { allowedMimeTypes: ['Text', 'application/json'] });
      expect(dragstart.data).toEqual({ 'application/json': '{"item":{"value":0,"label":"item0"},"type":""}' });
    });

    it('uses Text mime type in Internet Explorer', () => {
      component.dndType = 'Foo';
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('li')); // select the first item
      const dragstart = Dragstart.on(element, { allowedMimeTypes: ['URL', 'Text'] });
      expect(dragstart.data).toEqual({
        'Text': '{"item":{"value":0,"label":"item0"},"type":"foo"}'
      });
    });

    it('stops propagation', () => {
      const element = fixture.debugElement.query(By.css('li')); // select the first item
      expect(Dragstart.on(element).propagationStopped).toBe(true);
    });

  });

});
