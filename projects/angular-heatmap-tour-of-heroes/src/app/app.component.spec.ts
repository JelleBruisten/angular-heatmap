import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {
  AngularHeatMapModule, AngularHeatMapService
} from 'projects/angular-heatmap/src/public-api';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let service: AngularHeatMapService;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        AngularHeatMapModule.forRoot()
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    service = TestBed.get(AngularHeatMapService);
  }));
});
