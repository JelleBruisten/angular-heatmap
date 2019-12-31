import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularHeatMapService } from '../public-api';
import { AngularHeatMapDirective } from './angular-heat-map.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AngularHeatMapService
  ],
  declarations: [
    AngularHeatMapDirective,
  ],
  exports: [
    AngularHeatMapDirective
  ]
})
export class HeatMapModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HeatMapModule,
      providers: [ AngularHeatMapService ]
    };
  }
}
