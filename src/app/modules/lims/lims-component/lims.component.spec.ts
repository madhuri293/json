import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LIMSComponent } from './lims.component';

describe('LIMSComponent', () => {
  let component: LIMSComponent;
  let fixture: ComponentFixture<LIMSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LIMSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LIMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
