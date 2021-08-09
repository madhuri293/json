import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalystMainMastersComponent } from './catalyst-main-masters.component';

describe('CatalystMainMastersComponent', () => {
  let component: CatalystMainMastersComponent;
  let fixture: ComponentFixture<CatalystMainMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatalystMainMastersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalystMainMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
