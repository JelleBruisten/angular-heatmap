# AngularHeatmap

## Running demo project:
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Using the AngularHeatMapService
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

