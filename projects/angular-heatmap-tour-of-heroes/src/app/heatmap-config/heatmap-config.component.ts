import { Component, OnInit, Inject } from '@angular/core';
import { ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfig, AngularHeatMapService } from 'projects/angular-heatmap/src/public-api';

@Component({
  selector: 'app-heatmap-config',
  templateUrl: './heatmap-config.component.html',
  styleUrls: ['./heatmap-config.component.css']
})
export class HeatmapConfigComponent implements OnInit {

  constructor(@Inject(ANGULAR_HEATMAP_CONFIG) public config: AngularHeatMapConfig, private service: AngularHeatMapService) { }

  configChanged() {
    this.service.update();
    // trigger a redraw xD?
  }

  ngOnInit(): void {
  }

}
