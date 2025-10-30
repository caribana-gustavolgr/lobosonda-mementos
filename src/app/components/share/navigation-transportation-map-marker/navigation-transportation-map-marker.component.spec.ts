import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTransportationMapMarkerComponent } from './navigation-transportation-map-marker.component';

describe('NavigationTransportationMapMarker', () => {
  let component: NavigationTransportationMapMarkerComponent;
  let fixture: ComponentFixture<NavigationTransportationMapMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationTransportationMapMarkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationTransportationMapMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
