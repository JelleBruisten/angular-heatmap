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
