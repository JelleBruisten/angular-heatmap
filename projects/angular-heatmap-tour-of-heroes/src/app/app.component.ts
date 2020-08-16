import { Component, ViewChild, Inject, OnDestroy } from '@angular/core';
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
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Tour of Heroes';

}
