import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLoadComponent } from './view-load.component';

describe('ViewLoadComponent', () => {
  let component: ViewLoadComponent;
  let fixture: ComponentFixture<ViewLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLoadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
