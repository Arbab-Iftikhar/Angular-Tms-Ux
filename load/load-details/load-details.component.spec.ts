import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsComponent } from './load-details.component';

describe('LoadDetailsComponent', () => {
  let component: LoadDetailsComponent;
  let fixture: ComponentFixture<LoadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
