import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosZubaidaComponent } from './pos-zubaida.component';

describe('PosZubaidaComponent', () => {
  let component: PosZubaidaComponent;
  let fixture: ComponentFixture<PosZubaidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosZubaidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosZubaidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
