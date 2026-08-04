import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentSettlementComponent } from './adjustment-settlement.component';

describe('AdjustmentSettlementComponent', () => {
  let component: AdjustmentSettlementComponent;
  let fixture: ComponentFixture<AdjustmentSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
