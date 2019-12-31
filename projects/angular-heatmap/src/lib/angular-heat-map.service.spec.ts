import { TestBed } from '@angular/core/testing';

import { AngularHeatMapService } from './angular-heat-map.service';

describe('AngularHeatmapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularHeatMapService = TestBed.get(AngularHeatMapService);
    expect(service).toBeTruthy();
  });
});
