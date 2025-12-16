import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerListadoSaldosComponent } from './ver-listado-saldos.component';

describe('VerListadoSaldosComponent', () => {
  let component: VerListadoSaldosComponent;
  let fixture: ComponentFixture<VerListadoSaldosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerListadoSaldosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerListadoSaldosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
