import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineEditorComponentComponent } from './line-editor-component.component';

describe('LineEditorComponentComponent', () => {
  let component: LineEditorComponentComponent;
  let fixture: ComponentFixture<LineEditorComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineEditorComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineEditorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
