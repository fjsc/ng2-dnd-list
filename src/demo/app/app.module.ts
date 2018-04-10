import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DndDemosModule } from './modules/cnd-demos/dnd-demos.module';
import { SimpleDemoComponent } from './modules/cnd-demos/components/simple/simple-demo.component';
import { AdvancedDemoComponent } from './modules/cnd-demos/components/advanced/advanced-demo.component';
import { MultiDemoComponent } from './modules/cnd-demos/components/multi/multi-demo.component';

const appRoutes: Routes = [
   {
      path: 'simple-demo',
      component: SimpleDemoComponent
   },
   {
      path: 'advanced-demo',
      component: AdvancedDemoComponent
   },
   {
      path: 'multiselection-demo',
      component: MultiDemoComponent
   },
   {
      path: '**',
      redirectTo: 'simple-demo'
   }
];

@NgModule({
   declarations: [
      AppComponent
   ],
   imports: [
      BrowserModule,
      DndDemosModule,
      RouterModule.forRoot(appRoutes, { useHash: true })
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
