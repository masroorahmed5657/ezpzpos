import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAdjustmentComponent } from './sales-adjustment.component';

describe('SalesAdjustmentComponent', () => {
  let component: SalesAdjustmentComponent;
  let fixture: ComponentFixture<SalesAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesAdjustmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
