import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosRestaurantComponent } from './pos-restaurant.component';

describe('PosRestaurantComponent', () => {
  let component: PosRestaurantComponent;
  let fixture: ComponentFixture<PosRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosRestaurantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
