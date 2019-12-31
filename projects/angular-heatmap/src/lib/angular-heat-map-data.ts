export interface HeatMapData {
  path: string;
  windowHeight: number;
  windowWidth: number;
  movements: HeatMapDataPoint[];
}

export interface HeatMapDataPoint {
  x: number;
  y: number;
}
