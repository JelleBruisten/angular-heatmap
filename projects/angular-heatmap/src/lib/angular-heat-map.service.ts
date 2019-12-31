import { Injectable, OnDestroy } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable, Subscription, Subject, fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import { HeatMapData } from './angular-heat-map-data';

@Injectable()
export class AngularHeatMapService implements OnDestroy {

  protected mouseMoveStream: Observable<Event>;
  private mouseMoveSubscription: Subscription;
  protected resizeStream: Observable<Event>;
  private resizeSubscription: Subscription;

  protected currentRouterPath = '';
  protected windowHeight = 0;
  protected windowWidth = 0;

  protected currentHeatmap: HeatMapData;
  protected currentHeatmapSubject: Subject<HeatMapData> = new Subject<HeatMapData>();
  protected HeatMapData: HeatMapData[] = [];
  protected HeatMapDataSubject: Subject<HeatMapData[]> = new Subject<HeatMapData[]>();

  public get HeatMapData$() {
    return this.HeatMapDataSubject.asObservable();
  }

  public get currentHeatMap$() {
    return this.currentHeatmapSubject.asObservable();
  }

  constructor(private router: Router) {

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
    this.mouseMoveStream = fromEvent<MouseEvent>(document, 'mousemove');
    this.mouseMoveSubscription = this.mouseMoveStream
    .pipe(auditTime(10))
    .subscribe((event: MouseEvent) => {
      this.logTrackingEvent(event);
    });

    // listen on resize
    this.resizeStream = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeStream.subscribe((event) => {
      this.updateWindowSize();
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

  protected logTrackingEvent(event: MouseEvent) {

    this.currentHeatmap.movements.push({
      x: event.clientX,
      y: event.clientY
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
