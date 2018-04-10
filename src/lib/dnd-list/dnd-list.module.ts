import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DndDraggableDirective } from './directives/dnd-draggable.directive';
import { DndDraggableService } from './services/dnd-draggable.service';
import { DndListDirective } from './directives/dnd-list.directive';
import { DndNodragDirective } from './directives/dnd-nodrag.directive';
import { DndHandleDirective } from './directives/dnd-handle.directive';

const declarations = [
  DndDraggableDirective,
  DndListDirective,
  DndNodragDirective,
  DndHandleDirective
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: declarations,
  providers: [
    DndDraggableService
  ],
  exports: declarations
})
export class DndListModule { }
