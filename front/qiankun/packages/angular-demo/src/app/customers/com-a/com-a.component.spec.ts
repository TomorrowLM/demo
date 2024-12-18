import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComAComponent } from './com-a.component';

describe('ComAComponent', () => {
  let component: ComAComponent;
  let fixture: ComponentFixture<ComAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
