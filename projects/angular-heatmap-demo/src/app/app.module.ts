
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';
import { Page3Component } from './page3/page3.component';
import { Page4Component } from './page4/page4.component';
import { AngularHeatMapModule, ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfigFactory } from 'projects/angular-heatmap/src/public-api';

@NgModule({
  declarations: [
    AppComponent,
    Page1Component,
    Page2Component,
    Page3Component,
    Page4Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularHeatMapModule.forRoot()
  ],
  providers: [ {
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
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
