import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddSubject } from './edit-add-subject';

describe('EditAddSubject', () => {
  let component: EditAddSubject;
  let fixture: ComponentFixture<EditAddSubject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAddSubject],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAddSubject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
