import { Component, OnDestroy, Inject, ViewChild } from '@angular/core';
import { HeatMapData } from 'projects/angular-heatmap/src/lib/angular-heat-map-data';
import { Subscription } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { AngularHeatMapService, AngularHeatMapConfig, ANGULAR_HEATMAP_CONFIG, AngularHeatMapDirective } from 'projects/angular-heatmap/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  data: HeatMapData;
  currentHeatMapSubscription: Subscription;
  @ViewChild(AngularHeatMapDirective, {static: false}) angularHeatMap: AngularHeatMapDirective;

  constructor(private service: AngularHeatMapService, @Inject(ANGULAR_HEATMAP_CONFIG) private config: AngularHeatMapConfig) {
    this.currentHeatMapSubscription = this.service.currentHeatMap$.subscribe(data => {
      this.data = data;
    });
  }

  ngOnDestroy() {
    this.currentHeatMapSubscription.unsubscribe();
  }
}
