import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMapComponent } from './single-map.component';

describe('SingleMapComponent', () => {
  let component: SingleMapComponent;
  let fixture: ComponentFixture<SingleMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
