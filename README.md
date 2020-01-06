# AngularHeatmap

## Running demo project:
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Adding the module
Add the import in your appModule
```
import { AngularHeatMapModule, ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfigFactory } from 'projects/angular-heatmap/src/public-api';
```

Add the imported module to your ngModule:
```
@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    AngularHeatMapModule.forRoot()
  ]
})
```

To provide a configuration for the module add a ANGULAR_HEATMAP_CONFIG to providers of ngModule
```
  {
    provide: ANGULAR_HEATMAP_CONFIG,
    useValue: AngularHeatMapConfigFactory({
      heatMapPointRadiusBlur : 25,
      heatMapPointRadius : 5,
      heatMapPointAlpha: 0.5,
      pointerMovementsInterval: 10,
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
```

## Import the AngularHeatmapService
In some component that's gonna listen or consume data produced by the AngularHeatMapService inject it the usual angular way:
```
  constructor(private service: AngularHeatMapService)
```
You can start to listen to updates from the subjects provided in this service:
```
   this.currentHeatMapSubscription = this.service.currentHeatMap$.subscribe(data => {     
    console.log(data);
  });

  this.heatMapDataSubscription = this.service.heatMapData$.subscribe(data => {     
    console.log(data);
  });
```

Don't forget to unsubscribe
```
  ngOnDestroy() {
    if (this.currentHeatMapSubscription) {
      this.currentHeatMapSubscription.unsubscribe();
    }

    if (this.heatMapDataSubscription) {
      this.heatMapDataSubscription.unsubscribe();
    }    
  }
```


