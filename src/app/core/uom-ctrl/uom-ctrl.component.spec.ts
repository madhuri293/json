import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UomCtrlComponent } from './uom-ctrl.component';

describe('UomCtrlComponent', () => {
  let component: UomCtrlComponent;
  let fixture: ComponentFixture<UomCtrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UomCtrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UomCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
