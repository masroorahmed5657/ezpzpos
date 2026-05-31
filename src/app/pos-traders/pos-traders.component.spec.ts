import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTradersComponent } from './pos-traders.component';

describe('PosTradersComponent', () => {
  let component: PosTradersComponent;
  let fixture: ComponentFixture<PosTradersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosTradersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosTradersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
