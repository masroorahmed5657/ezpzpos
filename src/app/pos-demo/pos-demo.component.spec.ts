import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDemoComponent } from './pos-demo.component';

describe('PosDemoComponent', () => {
  let component: PosDemoComponent;
  let fixture: ComponentFixture<PosDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
