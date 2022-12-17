import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawFractalComponent } from './draw-fractal.component';

describe('DrawFractalComponent', () => {
  let component: DrawFractalComponent;
  let fixture: ComponentFixture<DrawFractalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawFractalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawFractalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
