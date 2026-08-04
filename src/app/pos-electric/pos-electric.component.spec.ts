import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosElectricComponent } from './pos-electric.component';

describe('PosElectricComponent', () => {
  let component: PosElectricComponent;
  let fixture: ComponentFixture<PosElectricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosElectricComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosElectricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
