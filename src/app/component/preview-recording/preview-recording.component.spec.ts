import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewRecordingComponent } from './preview-recording.component';

describe('PreviewRecordingComponent', () => {
  let component: PreviewRecordingComponent;
  let fixture: ComponentFixture<PreviewRecordingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewRecordingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
