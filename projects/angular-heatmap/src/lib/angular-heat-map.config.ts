import { InjectionToken } from '@angular/core';

export const ANGULAR_HEATMAP_CONFIG = new InjectionToken<AngularHeatMapConfig>('Angular Heatmap Configuration');

export interface AngularHeatMapConfig {
  mouseMovementsInterval?: number;
  heatMapPointRadius?: number;
  heatMapPointRadiusBlur?: number;
}

export const defaultAngularHeatMapConfig: AngularHeatMapConfig = {
  mouseMovementsInterval: 10,
  heatMapPointRadius: 5,
  heatMapPointRadiusBlur: 25
};

export function createAngularHeatMapConfig(config?: AngularHeatMapConfig): AngularHeatMapConfig {
  return { ... defaultAngularHeatMapConfig, ... config };
}
