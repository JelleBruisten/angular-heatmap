import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapViewerComponent } from './heatmap-viewer.component';

describe('HeatmapViewerComponent', () => {
  let component: HeatmapViewerComponent;
  let fixture: ComponentFixture<HeatmapViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatmapViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatmapViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
