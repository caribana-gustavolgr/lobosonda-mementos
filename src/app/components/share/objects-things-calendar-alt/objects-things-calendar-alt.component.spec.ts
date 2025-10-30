import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectsThingsCalendarAltComponent } from './objects-things-calendar-alt.component';

describe('ObjectsThingsCalendarAltComponent', () => {
  let component: ObjectsThingsCalendarAltComponent;
  let fixture: ComponentFixture<ObjectsThingsCalendarAltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectsThingsCalendarAltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectsThingsCalendarAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
