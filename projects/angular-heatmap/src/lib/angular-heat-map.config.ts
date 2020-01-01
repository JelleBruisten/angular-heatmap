import { InjectionToken } from '@angular/core';

export const ANGULAR_HEATMAP_CONFIG = new InjectionToken<AngularHeatMapConfig>('Angular Heatmap Configuration');

export interface AngularHeatMapConfig {
  mouseMovementsInterval?: number;
  maxMouseTickWithoutChange?: number;
  heatMapPointRadius?: number;
  heatMapPointRadiusBlur?: number;
  heatMapPointAlpha?: number;
  heatMapGradientColors?: {};
}

export const defaultAngularHeatMapConfig: AngularHeatMapConfig = {
  mouseMovementsInterval: 10,
  maxMouseTickWithoutChange: 2,
  heatMapPointRadius: 5,
  heatMapPointRadiusBlur: 25,
  heatMapPointAlpha: 0.5,
  heatMapGradientColors: {
    0.4 : 'blue',
    0.6 : 'cyan',
    0.7  : 'lime',
    0.8 : 'yellow',
    1 : 'red'
  }
};

export function createAngularHeatMapConfig(config?: AngularHeatMapConfig): AngularHeatMapConfig {
  return { ... defaultAngularHeatMapConfig, ... config };
}
