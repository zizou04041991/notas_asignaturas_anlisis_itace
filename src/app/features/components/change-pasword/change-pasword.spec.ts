import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasword } from './change-pasword';

describe('ChangePasword', () => {
  let component: ChangePasword;
  let fixture: ComponentFixture<ChangePasword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasword],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
