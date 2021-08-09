import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedStackCreateComponent } from './feed-stack-create.component';

describe('FeedStackCreateComponent', () => {
  let component: FeedStackCreateComponent;
  let fixture: ComponentFixture<FeedStackCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedStackCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedStackCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
