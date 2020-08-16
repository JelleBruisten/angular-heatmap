import { Subscription } from 'rxjs';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfig, AngularHeatMapService } from 'projects/angular-heatmap/src/public-api';
import { HeatmapToggleService } from '../heatmap-toggle.service';

@Component({
  selector: 'app-heatmap-config',
  templateUrl: './heatmap-config.component.html',
  styleUrls: ['./heatmap-config.component.css']
})
export class HeatmapConfigComponent implements OnInit, OnDestroy {

  toggleHeatMapSubscription: Subscription;
  toggled = true;

  constructor(
    @Inject(ANGULAR_HEATMAP_CONFIG) public config: AngularHeatMapConfig,
    private service: AngularHeatMapService,
    private heatmapToggleService: HeatmapToggleService
  ) { }

  configChanged() {
    this.service.update();
    // trigger a redraw xD?
  }

  toggleChanged() {
    if (this.toggled) {
      this.heatmapToggleService.enable();
      this.service.update();
    } else {
      this.heatmapToggleService.disable();
    }
  }

  ngOnInit(): void {
    this.toggleHeatMapSubscription = this.heatmapToggleService.toggled$.subscribe(toggled => this.toggled = toggled);
  }

  ngOnDestroy() {
    if (this.toggleHeatMapSubscription) {
      this.toggleHeatMapSubscription.unsubscribe();
    }
  }

}
