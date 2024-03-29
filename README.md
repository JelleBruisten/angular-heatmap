# AngularHeatmap
Angular Heatmap is a library for collecting user data for heatmaps. The data collected will include on what route path the user is, such that we can make seperate heatmaps for each route.

## Running demo project:
Run `ng serve --project=angular-heatmap-tour-of-heroes`

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

### Start the listeners
```
service.start();
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

### onDestroy()
Don't forget to unsubscribe from subscriptions, and if you want to stop all event listeners just call service.stop()
```
  ngOnDestroy() {

    // only if you want to stop tracking of pointer events
    service.stop();

    if (this.currentHeatMapSubscription) {
      this.currentHeatMapSubscription.unsubscribe();
    }

    if (this.heatMapDataSubscription) {
      this.heatMapDataSubscription.unsubscribe();
    }
  }
```

## Data format:
The produced data will always be in the form:
### path will be constructed from router events
url of example.com/user/edit/12398290380293 and a path in route configuration : /user/edit/:id
path will be filed with /user/edit/:id

### Movements:
Movements will be in format of {x: number, y: number}

To include timestamps in every move add the following to the configuration:
pointerMovementsIncludeTimestamp : true

### Data Interface:
```
export interface AngularHeatMapData {
  path: string;
  windowHeight: number;
  windowWidth: number;
  movements: AngularHeatMapDataPoint[];
}

export interface AngularHeatMapDataPoint {
  x: number;
  y: number;
}

export interface AngularHeatMapTimedDataPoint extends AngularHeatMapDataPoint {
  timestamp: number;
}
```

