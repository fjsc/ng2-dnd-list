import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DndListModule } from '@fjsc/ng-dnd-list';

import { SimpleDemoComponent } from './components/simple/simple-demo.component';
import { PrettyPrintPipe } from './pipes/pretty-print';
import { AdvancedDemoComponent } from './components/advanced/advanced-demo.component';
import { MultiDemoComponent } from './components/multi/multi-demo.component';

@NgModule({
  imports: [
    CommonModule,
    DndListModule
  ],
  declarations: [
    SimpleDemoComponent,
    AdvancedDemoComponent,
    MultiDemoComponent,
    PrettyPrintPipe
  ],
  exports: [
    SimpleDemoComponent,
    AdvancedDemoComponent,
    MultiDemoComponent
  ]
})
export class DndDemosModule { }
