import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCardsComponent } from './pos-cards.component';

describe('PosCardsComponent', () => {
  let component: PosCardsComponent;
  let fixture: ComponentFixture<PosCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
