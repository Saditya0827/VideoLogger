import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousLogComponent } from './previous-log.component';

describe('PreviousLogComponent', () => {
  let component: PreviousLogComponent;
  let fixture: ComponentFixture<PreviousLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
