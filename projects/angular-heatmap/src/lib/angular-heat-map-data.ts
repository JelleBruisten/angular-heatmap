export interface AngularHeatMapData {
  path: string;
  windowHeight: number;
  windowWidth: number;
  movements: AngularHeatMapDataPoint[];
}

export interface AngularHeatMapDataPoint {
  x: number;
  y: number;
}

export interface AngularHeatMapTimedDataPoint extends AngularHeatMapDataPoint {
  timestamp: number;
}
