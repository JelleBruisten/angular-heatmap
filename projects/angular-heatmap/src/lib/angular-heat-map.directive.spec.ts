import { AngularHeatMapDirective } from './angular-heat-map.directive';
import { TestBed } from '@angular/core/testing';
import { ANGULAR_HEATMAP_CONFIG, defaultAngularHeatMapConfig } from './angular-heat-map.config';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ElementRef } from '@angular/core';

describe('AngularHeatMapDirective', () => {

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [
      AngularHeatMapDirective
    ],
    imports : [
      RouterTestingModule
    ],
    providers: [
      {
        provide: ANGULAR_HEATMAP_CONFIG,
        useValue: defaultAngularHeatMapConfig
      }
    ]
  }));


  it('should create an instance', () => {

    const config = TestBed.get(ANGULAR_HEATMAP_CONFIG);
    const router = TestBed.get(Router);
    const element = document.createElement('canvas');
    const elementRef = new ElementRef(element);
    const directive = new AngularHeatMapDirective(config, elementRef, router);
    expect(directive).toBeTruthy();
  });
});
