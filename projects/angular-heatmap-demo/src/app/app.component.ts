import { Component, OnDestroy, Inject, ViewChild, OnInit } from '@angular/core';
import {
  AngularHeatMapData,
  AngularHeatMapService,
  AngularHeatMapConfig,
  ANGULAR_HEATMAP_CONFIG,
  AngularHeatMapDirective} from 'projects/angular-heatmap/src/public-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  data: AngularHeatMapData;
  currentHeatMapSubscription: Subscription;
  @ViewChild(AngularHeatMapDirective, {static: false}) angularHeatMap: AngularHeatMapDirective;

  constructor(
    private service: AngularHeatMapService,
    @Inject(ANGULAR_HEATMAP_CONFIG) public config: AngularHeatMapConfig
  ) {}

  ngOnInit() {
    this.service.start();
    this.currentHeatMapSubscription = this.service.currentHeatMap$.subscribe(data => {
      this.data = { ...data };
    });
  }

  ngOnDestroy() {
    if (this.currentHeatMapSubscription) {
      this.currentHeatMapSubscription.unsubscribe();
    }
  }
}
