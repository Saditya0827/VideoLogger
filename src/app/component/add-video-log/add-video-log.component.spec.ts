import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoLogComponent } from './add-video-log.component';

describe('AddVideoLogComponent', () => {
  let component: AddVideoLogComponent;
  let fixture: ComponentFixture<AddVideoLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVideoLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVideoLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
