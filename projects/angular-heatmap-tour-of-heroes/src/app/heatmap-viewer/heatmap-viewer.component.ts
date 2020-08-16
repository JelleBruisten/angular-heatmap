import { HeatmapToggleService } from './../heatmap-toggle.service';
import { Component, OnInit, OnDestroy, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { AngularHeatMapData, AngularHeatMapDirective, AngularHeatMapService, ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfig } from 'projects/angular-heatmap/src/public-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-heatmap-viewer',
  templateUrl: './heatmap-viewer.component.html',
  styleUrls: ['./heatmap-viewer.component.css']
})
export class HeatmapViewerComponent implements OnInit, OnDestroy {

  data: AngularHeatMapData;
  currentHeatMapSubscription: Subscription;
  toggled = true;
  toggleHeatMapSubscription: Subscription;

  constructor(
    private angularHeatMapService: AngularHeatMapService,
    @Inject(ANGULAR_HEATMAP_CONFIG) public config: AngularHeatMapConfig,
    private heatmapToggleService: HeatmapToggleService,
    private changeRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.currentHeatMapSubscription = this.angularHeatMapService.currentHeatMap$.subscribe(data => {
      this.data = { ...data };
    });

    this.toggleHeatMapSubscription = this.heatmapToggleService.toggled$.subscribe(toggled => {
      this.toggled = toggled;
      this.changeRef.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.currentHeatMapSubscription) {
      this.currentHeatMapSubscription.unsubscribe();
    }

    if (this.toggleHeatMapSubscription) {
      this.toggleHeatMapSubscription.unsubscribe();
    }
  }
}
