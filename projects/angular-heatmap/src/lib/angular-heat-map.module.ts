import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularHeatMapDirective } from './angular-heat-map.directive';
import { AngularHeatMapConfig, ANGULAR_HEATMAP_CONFIG, defaultAngularHeatMapConfig } from './angular-heat-map.config';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [],
  declarations: [
    AngularHeatMapDirective,
  ],
  exports: [
    AngularHeatMapDirective
  ]
})
export class AngularHeatMapModule {
  static forRoot(): ModuleWithProviders<AngularHeatMapModule> {
    return {
      ngModule: AngularHeatMapModule,
      providers: [
        {
          provide: ANGULAR_HEATMAP_CONFIG,
          useValue: defaultAngularHeatMapConfig
        }
      ]
    };
  }
}
