import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZreportComponent } from './zreport.component';

describe('ZreportComponent', () => {
  let component: ZreportComponent;
  let fixture: ComponentFixture<ZreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
