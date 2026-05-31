import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnExchangeReportComponent } from './return-exchange-report.component';

describe('ReturnExchangeReportComponent', () => {
  let component: ReturnExchangeReportComponent;
  let fixture: ComponentFixture<ReturnExchangeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnExchangeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnExchangeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
