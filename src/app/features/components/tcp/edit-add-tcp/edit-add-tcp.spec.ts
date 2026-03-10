import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddTcp } from './edit-add-tcp';

describe('EditAddTcp', () => {
  let component: EditAddTcp;
  let fixture: ComponentFixture<EditAddTcp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAddTcp],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAddTcp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
