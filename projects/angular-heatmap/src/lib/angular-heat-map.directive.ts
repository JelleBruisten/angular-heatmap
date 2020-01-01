import { Directive, ElementRef, Inject, OnInit, OnDestroy, AfterViewInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { HeatMapData, HeatMapDataPoint } from './angular-heat-map-data';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { AngularHeatMapService } from './angular-heat-map.service';
import { ANGULAR_HEATMAP_CONFIG, AngularHeatMapConfig } from './angular-heat-map.config';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

@Directive({
  selector: '[AngularHeatMap]'
})
export class AngularHeatMapDirective implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input('AngularHeatMapData')
  data: HeatMapData;
  config: AngularHeatMapConfig;

  @Input('AngularHeatMapConfig')
  set angularHeatMapConfig(config: AngularHeatMapConfig) {
    this.config = config;
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
    this.config = injectedConfig;
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
    this.ctx.globalAlpha = this.config.heatMapPointAlpha;
    this.ctx.shadowBlur = this.config.heatMapPointRadiusBlur;
    this.ctx.shadowColor = 'black';
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.config.heatMapPointAlpha})`;

    if (this.data && this.data.movements) {
      this.data.movements.forEach((p: HeatMapDataPoint) => {
        const x = 2 * p.x;
        const y = 2 * p.y;

        this.ctx.beginPath();
        this.ctx.shadowOffsetX = x;
        this.ctx.shadowOffsetY = y;
        this.ctx.arc(-p.x, -p.y, this.config.heatMapPointRadius, 0, Math.PI * 2, true);
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

    const colors = Object.keys(this.config.heatMapGradientColors);
    if (colors.length) {
      colors.forEach(key => {
        const offset = Number(key);
        if (!Number.isNaN(offset)) {
          gradiant.addColorStop(offset, this.config.heatMapGradientColors[key]);
        }
      });
    }
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
