import { Component, OnDestroy } from '@angular/core';
import { HeatMapData } from 'projects/angular-heatmap/src/lib/angular-heat-map-data';
import { Subscription } from 'rxjs';
import { AngularHeatMapService } from 'projects/angular-heatmap/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  data: HeatMapData;
  currentHeatMapSubscription: Subscription;

  constructor(private service: AngularHeatMapService) {
    this.currentHeatMapSubscription = this.service.currentHeatMap$.subscribe(data => {
      this.data = {... data };
    });
  }

  ngOnDestroy() {
    this.currentHeatMapSubscription.unsubscribe();
  }
}
