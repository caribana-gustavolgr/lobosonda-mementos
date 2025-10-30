import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowsChevronRightSmComponent } from './arrows-chevron-right-sm.component';

describe('ArrowsChevronRightSmComponent', () => {
  let component: ArrowsChevronRightSmComponent;
  let fixture: ComponentFixture<ArrowsChevronRightSmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowsChevronRightSmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowsChevronRightSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
