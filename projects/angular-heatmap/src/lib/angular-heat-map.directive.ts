import { Directive, ElementRef, Inject, OnInit, OnDestroy, AfterViewInit, Input, OnChanges } from '@angular/core';
import { AngularHeatMapData, AngularHeatMapDataPoint } from './angular-heat-map-data';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfig, AngularHeatMapGradientColor } from './angular-heat-map.config';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[AngularHeatMap]'
})
export class AngularHeatMapDirective implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input()
  AngularHeatMapData: AngularHeatMapData;
  heatmapConfig: AngularHeatMapConfig;

  @Input()
  set AngularHeatMapConfig(config: AngularHeatMapConfig) {
    this.heatmapConfig = config;
    this.createGradiant();
  }

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  gradiant: ImageData;
  scrollEvent: Observable<Event>;
  scrolEventSubscription: Subscription;

  constructor(
    @Inject(ANGULAR_HEATMAP_CONFIG) injectedConfig: AngularHeatMapConfig,
    private elementRef: ElementRef,
    private router: Router,
    ) {
    if (elementRef.nativeElement instanceof HTMLCanvasElement) {
      this.canvas = elementRef.nativeElement;
    } else {
      this.canvas = document.createElement('canvas');
      this.elementRef.nativeElement.append(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');

    // create gradiant
    this.heatmapConfig = injectedConfig;
    this.createGradiant();
  }

  ngOnChanges() {
    this.draw();
  }

  ngOnInit() {
    const scrollEvent = fromEvent(window, 'scroll', {
      passive: true
    });
    this.scrolEventSubscription = scrollEvent.subscribe(() => {
      this.draw();
    });
  }

  ngAfterViewInit() {
    this.setCanvasSize();
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.setCanvasSize();
      }
    });
  }

  setCanvasSize() {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
  }

  draw() {
    // clear ec
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw a black/white image with blurred effects
    this.ctx.globalAlpha = this.heatmapConfig.heatMapPointAlpha;
    this.ctx.shadowBlur = this.heatmapConfig.heatMapPointRadiusBlur;
    this.ctx.shadowColor = 'black';
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.heatmapConfig.heatMapPointAlpha})`;

    if (this.AngularHeatMapData && this.AngularHeatMapData.movements) {
      this.AngularHeatMapData.movements.forEach((p: AngularHeatMapDataPoint) => {
        const x = 2 * p.x;
        const y = 2 * p.y;

        this.ctx.beginPath();
        this.ctx.shadowOffsetX = x;
        this.ctx.shadowOffsetY = y;
        this.ctx.arc(-p.x, -p.y, this.heatmapConfig.heatMapPointRadius, 0, Math.PI * 2, true);
        this.ctx.fill();
        this.ctx.closePath();
      });
    }

    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.createColorData(imageData.data);
    this.ctx.putImageData(imageData, 0, 0);
  }

  ngOnDestroy() {
    this.scrolEventSubscription.unsubscribe();
  }

  createGradiant() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const gradiant = ctx.createLinearGradient(0, 0, 0, 256);
    canvas.width = 256;
    canvas.height = 256;
    this.heatmapConfig.heatMapGradientColors.forEach((colorStop: AngularHeatMapGradientColor) => {
      gradiant.addColorStop(colorStop.offset, colorStop.color);
    });

    ctx.fillStyle = gradiant;
    ctx.fillRect(0, 0, 1, 256);
    this.gradiant = ctx.getImageData(0, 0, 1, 256);
  }

  createColorData(pixels: Uint8ClampedArray) {
    const gradiant = this.gradiant;
    if (gradiant) {
      for (let i = 0; i < pixels.length; i += 4) {

        // we only care about every 4th byte so i + 3 ( 4th, with our loop going 4 ahead everytime)
        const alpha = pixels[i + 3] * 4;

        if (alpha > 0) {
          pixels[i] = gradiant.data[alpha];
          pixels[i + 1] = gradiant.data[alpha + 1];
          pixels[i + 2] = gradiant.data[alpha + 2];
        }
      }
    } else {
      console.error('gradient does not exist');
    }
  }
}
