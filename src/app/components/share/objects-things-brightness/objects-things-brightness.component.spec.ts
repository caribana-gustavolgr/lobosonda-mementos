import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectsThingsBrightness } from './objects-things-brightness';

describe('ObjectsThingsBrightness', () => {
  let component: ObjectsThingsBrightness;
  let fixture: ComponentFixture<ObjectsThingsBrightness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectsThingsBrightness]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectsThingsBrightness);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
