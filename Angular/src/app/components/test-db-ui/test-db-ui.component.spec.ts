import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDbUiComponent } from './test-db-ui.component';

describe('TestDbUiComponent', () => {
  let component: TestDbUiComponent;
  let fixture: ComponentFixture<TestDbUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestDbUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDbUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
