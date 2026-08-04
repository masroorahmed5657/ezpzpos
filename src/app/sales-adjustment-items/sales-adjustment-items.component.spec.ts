import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAdjustmentItemsComponent } from './sales-adjustment-items.component';

describe('SalesAdjustmentItemsComponent', () => {
  let component: SalesAdjustmentItemsComponent;
  let fixture: ComponentFixture<SalesAdjustmentItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesAdjustmentItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesAdjustmentItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
