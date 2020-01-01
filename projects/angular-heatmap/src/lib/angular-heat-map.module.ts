import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularHeatMapDirective } from './angular-heat-map.directive';
import { AngularHeatMapConfig, ANGULAR_HEATMAP_CONFIG, defaultAngularHeatMapConfig } from './angular-heat-map.config';
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
export class AngularHeatMapModule {
  static forRoot(config?: AngularHeatMapConfig): ModuleWithProviders {
    const conf = { ... defaultAngularHeatMapConfig, ... config };
    return {
      ngModule: AngularHeatMapModule,
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
