import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularHeatMapDirective } from './angular-heat-map.directive';
import { AngularHeatMapConfig, createAngularHeatMapConfig, ANGULAR_HEATMAP_CONFIG } from './angular-heat-map.config';
import { AngularHeatMapService } from './angular-heat-map.service';

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
  static forRoot(config?: AngularHeatMapConfig): ModuleWithProviders {
    const conf = createAngularHeatMapConfig(config);
    return {
      ngModule: HeatMapModule,
      providers: [
        AngularHeatMapService,
        {
          provide: ANGULAR_HEATMAP_CONFIG,
          useValue: conf
        }
      ]
    };
  }
}
