import { Injectable, OnDestroy, Inject } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable, Subscription, Subject, fromEvent, timer } from 'rxjs';
import { AngularHeatMapData, AngularHeatMapTimedDataPoint } from './angular-heat-map-data';
import { ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfig } from './angular-heat-map.config';

@Injectable({
  providedIn: 'root'
})
export class AngularHeatMapService implements OnDestroy {

  protected pointerMoveStream: Observable<Event>;
  private pointerMoveSubscription: Subscription;
  protected resizeStream: Observable<Event>;
  private resizeSubscription: Subscription;

  protected currentRouterPath = '';
  protected windowHeight = 0;
  protected windowWidth = 0;
  protected pointerX = -10;
  protected pointerY = -10;

  protected currentHeatmap: AngularHeatMapData;
  protected currentHeatmapSubject: Subject<AngularHeatMapData> = new Subject<AngularHeatMapData>();
  protected heatMapData: AngularHeatMapData[] = [];
  protected heatMapDataSubject: Subject<AngularHeatMapData[]> = new Subject<AngularHeatMapData[]>();
  protected timer: Observable<number>;
  protected timerSubscription: Subscription;
  protected pointerLeaveStream: Observable<PointerEvent>;
  protected pointerLeaveSubscription: Subscription;
  protected changeTimer = 0;

  public get heatMapData$() {
    return this.heatMapDataSubject.asObservable();
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

    // listen on pointer movements
    this.pointerMoveStream = fromEvent<PointerEvent>(document, 'pointermove', {
      passive: true
    });
    this.pointerMoveSubscription = this.pointerMoveStream
    .subscribe((event: PointerEvent) => {
      this.updatePointerPosition(event);
    });

    this.pointerLeaveStream = fromEvent<PointerEvent>(document, 'pointerleave');
    this.pointerLeaveSubscription = this.pointerLeaveStream.subscribe(() => {
      this.changeTimer = this.config.maxPointerTickWithoutChange;
    });

    // listen on resize
    this.resizeStream = fromEvent(window, 'resize', {
      passive: true
    });
    this.resizeSubscription = this.resizeStream.subscribe((event) => {
      this.updateWindowSize();
    });

    this.timer = timer(0, this.config.pointerMovementsInterval);
    this.timerSubscription = this.timer.subscribe(() => {
      if (this.changeTimer < this.config.maxPointerTickWithoutChange) {
        this.changeTimer++;
        this.addTrackingLog();
      }
    });

    // init sizes
    this.windowHeight = window.outerHeight;
    this.windowWidth = window.outerWidth;
  }

  protected findTrackingObject(): AngularHeatMapData | undefined {
    return this.heatMapData.find((a: AngularHeatMapData) => {
      return a.windowHeight === this.windowHeight && a.windowWidth === this.windowWidth && this.currentRouterPath === a.path;
    });
  }

  protected updateWindowSize() {
    this.windowHeight = window.outerHeight;
    this.windowWidth = window.outerWidth;
    this.updateHeatMapData();
  }

  protected updatePointerPosition(event: PointerEvent) {
    this.changeTimer = 0;
    this.pointerX = event.pageX;
    this.pointerY = event.pageY;
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
    const newTrackingObject: AngularHeatMapData = {
      windowHeight: this.windowHeight,
      windowWidth: this.windowWidth,
      path: this.currentRouterPath,
      movements: []
    };
    this.heatMapData.push(newTrackingObject);
    this.currentHeatmap = newTrackingObject;
  }

  protected addTrackingLog() {
    if (
      this.pointerX > 0 &&
      // this.windowWidth > this.pointerX &&
      this.pointerY > 0
      // this.windowHeight > this.pointerY
    ) {

      if (this.config.pointerMovementsIncludeTimestamp) {
        const p: AngularHeatMapTimedDataPoint = {
          x: this.pointerX,
          y: this.pointerY,
          timestamp : new Date().getTime()
        };
        this.currentHeatmap.movements.push(p);
      } else {
        this.currentHeatmap.movements.push({
          x: this.pointerX,
          y: this.pointerY
        });
      }
      this.update();
    }
  }

  protected update() {
    this.heatMapDataSubject.next([ ... this.heatMapData ]);
    this.currentHeatmapSubject.next({ ...this.currentHeatmap });
  }

  ngOnDestroy() {
    this.pointerMoveSubscription.unsubscribe();
    this.resizeSubscription.unsubscribe();
    this.pointerLeaveSubscription.unsubscribe();
  }
}
