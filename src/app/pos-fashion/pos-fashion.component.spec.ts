import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFashionComponent } from './pos-fashion.component';

describe('PosFashionComponent', () => {
  let component: PosFashionComponent;
  let fixture: ComponentFixture<PosFashionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFashionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFashionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
