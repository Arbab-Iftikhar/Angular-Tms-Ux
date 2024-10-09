import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveLoadsComponent } from './assign-loads.component';

describe('ActiveLoadsComponent', () => {
  let component: ActiveLoadsComponent;
  let fixture: ComponentFixture<ActiveLoadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveLoadsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveLoadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
