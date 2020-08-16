import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './heroes/heroes.component';
import { MessagesComponent } from './messages/messages.component';

import { AppRoutingModule } from './app-routing.module';
import { ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfigFactory, AngularHeatMapModule } from 'projects/angular-heatmap/src/public-api';
import { HeatmapViewerComponent } from './heatmap-viewer/heatmap-viewer.component';
import { HeatmapConfigComponent } from './heatmap-config/heatmap-config.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularHeatMapModule.forRoot()
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    HeatmapViewerComponent,
    HeatmapConfigComponent
  ],
  bootstrap: [ AppComponent, HeatmapViewerComponent ],
  providers: [
    {
      provide: ANGULAR_HEATMAP_CONFIG,
      useValue: AngularHeatMapConfigFactory({
        heatMapPointRadiusBlur : 25,
        heatMapPointRadius : 5,
        heatMapPointAlpha: 0.5,
        mouseMovementsInterval: 10,
        heatMapGradientColors: [
          { offset : 0.4, color: 'blue' },
          { offset : 0.6, color: 'cyan' },
          { offset : 0.7, color: 'lime' },
          { offset : 0.8, color: 'yellow' },
          { offset : 0.9, color: 'orange' },
          { offset : 1,   color: 'red' }
        ]
      })
    }
  ]
})
export class AppModule { }
