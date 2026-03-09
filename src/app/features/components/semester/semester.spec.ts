import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Semester } from './semester';

describe('Semester', () => {
  let component: Semester;
  let fixture: ComponentFixture<Semester>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Semester],
    }).compileComponents();

    fixture = TestBed.createComponent(Semester);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
