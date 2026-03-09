import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectItace } from './subject-itace';

describe('SubjectItace', () => {
  let component: SubjectItace;
  let fixture: ComponentFixture<SubjectItace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectItace],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectItace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
