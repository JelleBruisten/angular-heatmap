import { Injectable, OnDestroy, Inject } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable, Subscription, Subject, fromEvent, timer } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import { HeatMapData } from './angular-heat-map-data';
import { ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfig } from './angular-heat-map.config';

@Injectable()
export class AngularHeatMapService implements OnDestroy {

  protected mouseMoveStream: Observable<Event>;
  private mouseMoveSubscription: Subscription;
  protected resizeStream: Observable<Event>;
  private resizeSubscription: Subscription;

  protected currentRouterPath = '';
  protected windowHeight = 0;
  protected windowWidth = 0;
  protected mouseX = 0;
  protected mouseY = 0;

  protected currentHeatmap: HeatMapData;
  protected currentHeatmapSubject: Subject<HeatMapData> = new Subject<HeatMapData>();
  protected HeatMapData: HeatMapData[] = [];
  protected HeatMapDataSubject: Subject<HeatMapData[]> = new Subject<HeatMapData[]>();
  timer: Observable<number>;
  timerSubscription: Subscription;

  public get HeatMapData$() {
    return this.HeatMapDataSubject.asObservable();
  }

  public get currentHeatMap$() {
    return this.currentHeatmapSubject.asObservable();
  }

  constructor(
    @Inject(ANGULAR_HEATMAP_CONFIG) private config: AngularHeatMapConfig,
    private router: Router
  ) {

    this.updateHeatMapData();

    // listen on router events
    let path = '';
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof ActivationEnd) {
        if (event.snapshot) {
            if (event.snapshot.routeConfig && event.snapshot.routeConfig.path) {
                path = path === '' ? event.snapshot.routeConfig.path : [event.snapshot.routeConfig.path, path].join('/');
            }
        }
      }

      if (event instanceof NavigationEnd) {
        this.currentRouterPath = path;
        path = '';
        this.updateHeatMapData();
      }
    });

    // listen on mouse movements
    this.mouseMoveStream = fromEvent<MouseEvent>(document, 'mousemove', {
      passive: true
    });
    this.mouseMoveSubscription = this.mouseMoveStream
    .subscribe((event: MouseEvent) => {
      this.updateMousePosition(event);
    });

    // listen on resize
    this.resizeStream = fromEvent(window, 'resize', {
      passive: true
    });
    this.resizeSubscription = this.resizeStream.subscribe((event) => {
      this.updateWindowSize();
    });

    this.timer = timer(0, this.config.mouseMovementsInterval);
    this.timerSubscription = this.timer.subscribe(() => {
      this.addTrackingLog();
    });

    // init sizes
    this.windowHeight = window.outerHeight;
    this.windowWidth = window.outerWidth;
  }

  protected findTrackingObject(): HeatMapData | undefined {
    return this.HeatMapData.find((a: HeatMapData) => {
      return a.windowHeight === this.windowHeight && a.windowWidth === this.windowWidth && this.currentRouterPath === a.path;
    });
  }

  protected updateWindowSize() {
    this.windowHeight = window.outerHeight;
    this.windowWidth = window.outerWidth;
    this.updateHeatMapData();
  }

  protected updateMousePosition(event: MouseEvent) {
    this.mouseX = event.pageX;
    this.mouseY = event.pageY;
  }

  protected updateHeatMapData() {
    const currentTrackingObject = this.findTrackingObject();
    if (currentTrackingObject) {
      this.currentHeatmap = currentTrackingObject;
    } else {
      this.createHeatMapData();
    }
    this.update();
  }

  protected createHeatMapData() {
    const newTrackingObject: HeatMapData = {
      windowHeight: this.windowHeight,
      windowWidth: this.windowWidth,
      path: this.currentRouterPath,
      movements: []
    };
    this.HeatMapData.push(newTrackingObject);
    this.currentHeatmap = newTrackingObject;
  }

  protected addTrackingLog() {
    this.currentHeatmap.movements.push({
      x: this.mouseX,
      y: this.mouseY
    });
    this.update();
  }

  protected update() {
    this.HeatMapDataSubject.next(this.HeatMapData);
    this.currentHeatmapSubject.next(this.currentHeatmap);
  }

  ngOnDestroy() {
    this.mouseMoveSubscription.unsubscribe();
    this.resizeSubscription.unsubscribe();
  }
}
