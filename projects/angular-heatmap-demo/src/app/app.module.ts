
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';
import { Page3Component } from './page3/page3.component';
import { Page4Component } from './page4/page4.component';
import { AngularHeatMapModule } from 'projects/angular-heatmap/src/lib/angular-heat-map.module';

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
    AngularHeatMapModule.forRoot({
      heatMapPointRadiusBlur : 25,
      heatMapPointRadius : 5,
      heatMapPointAlpha: 0.5,
      mouseMovementsInterval: 10,
      heatMapGradientColors: {
        0.4 : 'blue',
        0.6 : 'cyan',
        0.7  : 'lime',
        0.8 : 'yellow',
        0.9 : 'orange',
        1 : 'red'
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
