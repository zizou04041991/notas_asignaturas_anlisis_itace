import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddSemester } from './edit-add-semester';

describe('EditAddSemester', () => {
  let component: EditAddSemester;
  let fixture: ComponentFixture<EditAddSemester>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAddSemester],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAddSemester);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
