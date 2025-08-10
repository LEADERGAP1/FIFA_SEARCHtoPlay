import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerEdit } from './player-edit';

describe('PlayerEdit', () => {
  let component: PlayerEdit;
  let fixture: ComponentFixture<PlayerEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
