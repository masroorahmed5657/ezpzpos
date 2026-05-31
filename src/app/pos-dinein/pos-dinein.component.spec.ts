import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDineinComponent } from './pos-dinein.component';

describe('PosDineinComponent', () => {
  let component: PosDineinComponent;
  let fixture: ComponentFixture<PosDineinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosDineinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosDineinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
