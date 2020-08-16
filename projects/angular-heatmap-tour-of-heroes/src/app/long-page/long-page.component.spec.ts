import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongPageComponent } from './long-page.component';

describe('LongPageComponent', () => {
  let component: LongPageComponent;
  let fixture: ComponentFixture<LongPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LongPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
