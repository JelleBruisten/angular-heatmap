import { Component, OnDestroy, Inject, ViewChild } from '@angular/core';
import {
  AngularHeatMapData,
  AngularHeatMapService,
  AngularHeatMapConfig,
  ANGULAR_HEATMAP_CONFIG,
  AngularHeatMapDirective
} from 'projects/angular-heatmap/src/public-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  data: AngularHeatMapData;
  currentHeatMapSubscription: Subscription;
  @ViewChild(AngularHeatMapDirective, {static: false}) angularHeatMap: AngularHeatMapDirective;

  constructor(private service: AngularHeatMapService, @Inject(ANGULAR_HEATMAP_CONFIG) public config: AngularHeatMapConfig) {

    console.log(this.config);
    this.currentHeatMapSubscription = this.service.currentHeatMap$.subscribe(data => {
      this.data = { ...data };
      // console.log('data changed!', data);
    });
  }

  ngOnDestroy() {
    if(this.currentHeatMapSubscription) {
      this.currentHeatMapSubscription.unsubscribe();
    }
  }
}
