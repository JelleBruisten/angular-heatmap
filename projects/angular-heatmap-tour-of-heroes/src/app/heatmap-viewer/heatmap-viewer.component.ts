import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { AngularHeatMapData, AngularHeatMapDirective, AngularHeatMapService, ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfig } from 'projects/angular-heatmap/src/public-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-heatmap-viewer',
  templateUrl: './heatmap-viewer.component.html',
  styleUrls: ['./heatmap-viewer.component.css']
})
export class HeatmapViewerComponent implements OnDestroy {

  data: AngularHeatMapData;
  currentHeatMapSubscription: Subscription;
  @ViewChild(AngularHeatMapDirective) angularHeatMap: AngularHeatMapDirective;

  constructor(private service: AngularHeatMapService, @Inject(ANGULAR_HEATMAP_CONFIG) public config: AngularHeatMapConfig) {

    console.log(this.config);
    this.currentHeatMapSubscription = this.service.currentHeatMap$.subscribe(data => {
      this.data = { ...data };
      // console.log('data changed!', data);
    });
  }

  ngOnDestroy() {
    if (this.currentHeatMapSubscription) {
      this.currentHeatMapSubscription.unsubscribe();
    }
  }
}
