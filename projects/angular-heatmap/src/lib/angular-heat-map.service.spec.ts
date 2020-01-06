import { TestBed, async } from '@angular/core/testing';

import { AngularHeatMapService } from './angular-heat-map.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ANGULAR_HEATMAP_CONFIG, defaultAngularHeatMapConfig } from '../public-api';
import { isObservable } from 'rxjs';
import { AngularHeatMapData } from './angular-heat-map-data';

describe('AngularHeatmapService', () => {

  let service: AngularHeatMapService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        RouterTestingModule
      ],
      providers: [
        {
          provide: ANGULAR_HEATMAP_CONFIG,
          useValue: defaultAngularHeatMapConfig
        }
      ]
    });

    service = TestBed.get(AngularHeatMapService);
  });

  afterEach(() => {
    service.ngOnDestroy();
    service =  null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a observable for all heatMapData', () => {
    expect(isObservable(service.heatMapData$)).toBeTruthy();
  });

  it('should have a subject for current heatMapData', () => {
    expect(isObservable(service.currentHeatMap$)).toBeTruthy();
  });
});
