import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map-component/map.component';
import { FilterComponent } from './filter-component/filter.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: MapComponent 
      }
    ])
  ],
  declarations: [MapComponent, FilterComponent]
})
export class MapPageModule {}
