import { InjectionToken } from '@angular/core';

export const ANGULAR_HEATMAP_CONFIG = new InjectionToken<AngularHeatMapConfig>('Angular Heatmap Configuration');

export interface AngularHeatMapConfig {
  pointerMovementsIncludeTimestamp?: boolean;
  pointerMovementsInterval?: number;
  maxPointerTickWithoutChange?: number;
  heatMapPointRadius?: number;
  heatMapPointRadiusBlur?: number;
  heatMapPointAlpha?: number;
  heatMapGradientColors?: AngularHeatMapGradientColor[];
}

export interface AngularHeatMapGradientColor {
  offset: number;
  color: string;
}

export const defaultAngularHeatMapConfig: AngularHeatMapConfig = {
  pointerMovementsIncludeTimestamp: false,
  pointerMovementsInterval: 10,
  maxPointerTickWithoutChange: 2,
  heatMapPointRadius: 5,
  heatMapPointRadiusBlur: 25,
  heatMapPointAlpha: 0.5,
  heatMapGradientColors: [
    { offset : 0.4, color: 'blue' },
    { offset : 0.6, color: 'cyan' },
    { offset : 0.7, color: 'lime' },
    { offset : 0.8, color: 'yellow' },
    { offset : 1,   color: 'red' }
  ]
};

export function AngularHeatMapConfigFactory(config?: AngularHeatMapConfig): AngularHeatMapConfig {
  return { ... defaultAngularHeatMapConfig, ... config};
}
