import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpencamComponent } from './opencam.component';

describe('OpencamComponent', () => {
  let component: OpencamComponent;
  let fixture: ComponentFixture<OpencamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpencamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpencamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
