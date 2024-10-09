import { ComponentFixture, TestBed } from '@angular/core/testing';

import {LoadManagmentComponent} from './load-managment.component';

describe('LoadManagmentComponent', () => {
  let component: LoadManagmentComponent;
  let fixture: ComponentFixture<LoadManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadManagmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
