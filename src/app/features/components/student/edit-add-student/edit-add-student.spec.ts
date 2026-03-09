import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddStudent } from './edit-add-student';

describe('EditAddStudent', () => {
  let component: EditAddStudent;
  let fixture: ComponentFixture<EditAddStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAddStudent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAddStudent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
