import { TestBed } from '@angular/core/testing';

import { HeatmapToggleService } from './heatmap-toggle.service';

describe('HeatmapToggleService', () => {
  let service: HeatmapToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeatmapToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
