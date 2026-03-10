import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tcp } from './tcp';

describe('Tcp', () => {
  let component: Tcp;
  let fixture: ComponentFixture<Tcp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tcp],
    }).compileComponents();

    fixture = TestBed.createComponent(Tcp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
