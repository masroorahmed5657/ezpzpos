import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailysalereportComponent } from './dailysalereport.component';

describe('DailysalereportComponent', () => {
  let component: DailysalereportComponent;
  let fixture: ComponentFixture<DailysalereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailysalereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailysalereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
