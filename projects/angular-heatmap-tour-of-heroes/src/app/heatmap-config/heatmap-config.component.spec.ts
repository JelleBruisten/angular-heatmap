import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapConfigComponent } from './heatmap-config.component';

describe('HeatmapConfigComponent', () => {
  let component: HeatmapConfigComponent;
  let fixture: ComponentFixture<HeatmapConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatmapConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatmapConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
