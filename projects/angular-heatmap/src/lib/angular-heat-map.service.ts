import { Injectable, OnDestroy, Inject } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable, Subscription, Subject, fromEvent, timer } from 'rxjs';
import { AngularHeatMapData, AngularHeatMapTimedDataPoint } from './angular-heat-map-data';
import { ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfig } from './angular-heat-map.config';

@Injectable({
  providedIn: 'root'
})
export class AngularHeatMapService implements OnDestroy {

  /**
   * Initial datapoints
   */
  protected currentRouterPath = '';
  protected windowHeight = 0;
  protected windowWidth = 0;
  protected pointerX = -10;
  protected pointerY = -10;
  protected changeTimer = 0;

  /**
   * Subscriptions
   */
  private pointerMoveSubscription: Subscription;
  private pointerLeaveSubscription: Subscription;
  private resizeSubscription: Subscription;
  private timerSubscription: Subscription;
  private routerEventsSubscription: Subscription;

  /**
   * Heatmap data structure and observables
   */
  protected currentHeatmap: AngularHeatMapData;
  protected currentHeatmapSubject: Subject<AngularHeatMapData> = new Subject<AngularHeatMapData>();
  protected heatMapData: AngularHeatMapData[] = [];
  protected heatMapDataSubject: Subject<AngularHeatMapData[]> = new Subject<AngularHeatMapData[]>();

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
  }

  public initialize() {

    // init sizes
    this.windowHeight = window.outerHeight;
    this.windowWidth = window.outerWidth;

    this.updateHeatMapData();

    // listen on router events
    let path = '';

    if (!this.routerEventsSubscription) {
      this.routerEventsSubscription = this.router.events.subscribe((event: RouterEvent) => {
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
    }

    // listen on pointer movements
    if (!this.pointerMoveSubscription) {
      this.pointerMoveSubscription = fromEvent<PointerEvent>(
          document,
          'pointermove',
          { passive: true }
        ).subscribe((event: PointerEvent) => {
          this.updatePointerPosition(event);
      });
    }

    if (!this.pointerLeaveSubscription) {
      this.pointerLeaveSubscription = fromEvent<PointerEvent>(
          document,
          'pointerleave',
          { passive: true }
        ).subscribe(() => {
          this.changeTimer = this.config.maxPointerTickWithoutChange;
      });
    }

    // listen on resize
    if (!this.resizeStream) {
      this.resizeSubscription = fromEvent(
          window,
          'resize',
          { passive: true }
        ).subscribe(() => {
        this.updateWindowSize();
      });
    }

    if (!this.timerSubscription) {
      this.timerSubscription = timer(
        0,
        this.config.pointerMovementsInterval
      ).subscribe(() => {
        if (this.changeTimer < this.config.maxPointerTickWithoutChange) {
          this.changeTimer++;
          this.addTrackingLog();
        }
      });
    }
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

  protected clearData() {
    this.heatMapData = [];
    this.createHeatMapData();
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

    if (this.pointerMoveSubscription) {
      this.pointerMoveSubscription.unsubscribe();
      this.pointerMoveSubscription = undefined;
    }

    if (this.pointerLeaveSubscription) {
      this.pointerLeaveSubscription.unsubscribe();
      this.pointerLeaveSubscription = undefined;
    }

    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
      this.resizeSubscription = undefined;
    }

    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
      this.routerEventsSubscription = undefined;
    }

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }
}
