import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddNote } from './edit-add-note';

describe('EditAddNote', () => {
  let component: EditAddNote;
  let fixture: ComponentFixture<EditAddNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAddNote],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAddNote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
