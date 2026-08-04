import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPaintComponent } from './pos-paint.component';

describe('PosPaintComponent', () => {
  let component: PosPaintComponent;
  let fixture: ComponentFixture<PosPaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosPaintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosPaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
